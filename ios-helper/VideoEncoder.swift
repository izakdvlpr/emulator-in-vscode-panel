import CoreMedia
import CoreVideo
import Foundation
import IOSurface
import QuartzCore
import VideoToolbox

/// Rotação em quartos de volta anti-horários da imagem, igual ao `Rotation` do lado TS.
/// O framebuffer do simulador fica sempre em retrato; quem gira a imagem é o helper.
enum Rotation: Int {
  case portrait = 0, landscapeLeft = 1, upsideDown = 2, landscapeRight = 3

  var swapsAxes: Bool { rawValue % 2 == 1 }

  var angle: CFString {
    switch self {
    case .portrait: return kVTRotation_0
    case .landscapeLeft: return kVTRotation_CCW90
    case .upsideDown: return kVTRotation_180
    case .landscapeRight: return kVTRotation_CW90
    }
  }

  /// `UIDeviceOrientation` que a mensagem da purple port espera.
  var deviceOrientation: UInt32 {
    switch self {
    case .portrait: return 1
    case .landscapeLeft: return 3
    case .upsideDown: return 2
    case .landscapeRight: return 4
    }
  }
}

/// Gira um `CVPixelBuffer` BGRA. O pool é recriado se o tamanho do framebuffer mudar.
final class PixelRotator {
  let rotation: Rotation
  private var session: VTPixelRotationSession?
  private var pool: CVPixelBufferPool?
  private var poolSize = (width: 0, height: 0)

  init(rotation: Rotation) {
    self.rotation = rotation
    guard rotation != .portrait else { return }
    VTPixelRotationSessionCreate(nil, &session)
    if let session {
      VTSessionSetProperty(session, key: kVTPixelRotationPropertyKey_Rotation, value: rotation.angle)
    }
  }

  deinit {
    if let session { VTPixelRotationSessionInvalidate(session) }
  }

  func rotate(_ source: CVPixelBuffer) -> CVPixelBuffer? {
    guard let session else { return source }
    let width = CVPixelBufferGetWidth(source)
    let height = CVPixelBufferGetHeight(source)
    let size = rotation.swapsAxes ? (width: height, height: width) : (width: width, height: height)
    if pool == nil || poolSize != size {
      let attributes: [CFString: Any] = [
        kCVPixelBufferPixelFormatTypeKey: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey: size.width,
        kCVPixelBufferHeightKey: size.height,
        kCVPixelBufferIOSurfacePropertiesKey: [:] as CFDictionary,
      ]
      pool = nil
      CVPixelBufferPoolCreate(nil, nil, attributes as CFDictionary, &pool)
      poolSize = size
    }
    guard let pool else { return nil }
    var destination: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, pool, &destination)
    guard let destination else { return nil }
    let status = VTPixelRotationSessionRotateImage(session, source, destination)
    if status != noErr {
      log("rotate failed: \(status)")
      return nil
    }
    return destination
  }
}

func pixelBuffer(from surface: IOSurface) -> CVPixelBuffer? {
  var buffer: Unmanaged<CVPixelBuffer>?
  CVPixelBufferCreateWithIOSurface(nil, surface, nil, &buffer)
  return buffer?.takeRetainedValue()
}

/// Codifica o framebuffer em H.264 Annex B. O `VTCompressionSession` já escala para o tamanho
/// de saída, então não há passo de resize.
final class VideoEncoder {
  private let simulator: Simulator
  private let output: Output
  private let rotator: PixelRotator
  private let queue = DispatchQueue(label: "frames")
  private let session: VTCompressionSession
  private let startedAt = CACurrentMediaTime()
  let width: Int32
  let height: Int32

  // Estado abaixo só é tocado na `queue`.
  private var stopped = false
  private var forceKeyFrame = true
  private var pending = 0
  private var dropped = false

  // Com o encoder atrasado, frames intermediários são descartados e só o mais recente é
  // codificado quando a fila esvazia; senão a latência cresceria sem limite.
  private static let maxPending = 2

  init(simulator: Simulator, output: Output, rotation: Rotation, maxWidth: Int, maxHeight: Int) throws {
    self.simulator = simulator
    self.output = output
    rotator = PixelRotator(rotation: rotation)

    let surface = simulator.surface
    let sourceWidth = Double(rotation.swapsAxes ? surface.height : surface.width)
    let sourceHeight = Double(rotation.swapsAxes ? surface.width : surface.height)
    let scale = min(Double(max(maxWidth, 16)) / sourceWidth, Double(max(maxHeight, 16)) / sourceHeight, 1)
    // H.264 exige dimensões pares.
    width = Int32((sourceWidth * scale / 2).rounded()) * 2
    height = Int32((sourceHeight * scale / 2).rounded()) * 2

    var session: VTCompressionSession?
    let status = VTCompressionSessionCreate(
      allocator: nil, width: width, height: height, codecType: kCMVideoCodecType_H264,
      encoderSpecification: nil, imageBufferAttributes: nil, compressedDataAllocator: nil,
      outputCallback: nil, refcon: nil, compressionSessionOut: &session)
    guard status == noErr, let session else { throw HelperError("VTCompressionSessionCreate failed: \(status)") }
    self.session = session
    VTSessionSetProperty(session, key: kVTCompressionPropertyKey_RealTime, value: kCFBooleanTrue)
    VTSessionSetProperty(
      session, key: kVTCompressionPropertyKey_ProfileLevel, value: kVTProfileLevel_H264_ConstrainedBaseline_AutoLevel)
    // Sem B-frames: cada access unit pode ser decodificado assim que chega.
    VTSessionSetProperty(session, key: kVTCompressionPropertyKey_AllowFrameReordering, value: kCFBooleanFalse)
    VTSessionSetProperty(session, key: kVTCompressionPropertyKey_MaxKeyFrameIntervalDuration, value: 2 as CFNumber)
    VTSessionSetProperty(session, key: kVTCompressionPropertyKey_AverageBitRate, value: 4_000_000 as CFNumber)
    VTCompressionSessionPrepareToEncodeFrames(session)
  }

  func start() {
    output.event(["event": "video", "width": width, "height": height, "rotation": rotator.rotation.rawValue])
    simulator.observeScreen(queue: queue) { [weak self] in self?.encode() }
    // A tela parada não dispara callback: o primeiro frame (keyframe) sai daqui.
    queue.async { [weak self] in self?.encode() }
  }

  /// Retorna só depois do último access unit ter sido escrito, para que o evento `video` de um
  /// stream novo nunca chegue antes de frames do antigo.
  func stop() {
    queue.sync {
      stopped = true
      simulator.stopObservingScreen()
    }
    VTCompressionSessionCompleteFrames(session, untilPresentationTimeStamp: .invalid)
    VTCompressionSessionInvalidate(session)
  }

  private func encode() {
    guard !stopped else { return }
    guard pending < VideoEncoder.maxPending else {
      dropped = true
      return
    }
    guard let source = pixelBuffer(from: simulator.surface), let frame = rotator.rotate(source) else { return }

    let timestamp = CMTime(seconds: CACurrentMediaTime() - startedAt, preferredTimescale: 1_000_000)
    let properties: CFDictionary? =
      forceKeyFrame ? [kVTEncodeFrameOptionKey_ForceKeyFrame: true] as CFDictionary : nil
    pending += 1
    let status = VTCompressionSessionEncodeFrame(
      session, imageBuffer: frame, presentationTimeStamp: timestamp, duration: .invalid,
      frameProperties: properties, infoFlagsOut: nil
    ) { [weak self] status, _, sample in
      guard let self else { return }
      if status == noErr, let sample { self.write(sample) }
      self.queue.async {
        self.pending -= 1
        if self.dropped && self.pending == 0 {
          self.dropped = false
          self.encode()
        }
      }
    }
    if status == noErr {
      forceKeyFrame = false
    } else {
      pending -= 1
      log("encode failed: \(status)")
    }
  }

  private func write(_ sample: CMSampleBuffer) {
    let attachments = CMSampleBufferGetSampleAttachmentsArray(sample, createIfNecessary: false) as? [[CFString: Any]]
    let key = !(attachments?.first?[kCMSampleAttachmentKey_NotSync] as? Bool ?? false)
    let startCode: [UInt8] = [0, 0, 0, 1]

    var payload = Data([key ? 1 : 0])
    let seconds = CMSampleBufferGetPresentationTimeStamp(sample).seconds
    payload.appendBigEndian(UInt64(max(0, seconds * 1_000_000)))

    // O decoder da webview precisa de SPS/PPS em banda antes de cada keyframe.
    if key, let format = CMSampleBufferGetFormatDescription(sample) {
      var count = 0
      CMVideoFormatDescriptionGetH264ParameterSetAtIndex(
        format, parameterSetIndex: 0, parameterSetPointerOut: nil, parameterSetSizeOut: nil,
        parameterSetCountOut: &count, nalUnitHeaderLengthOut: nil)
      for index in 0..<count {
        var pointer: UnsafePointer<UInt8>?
        var size = 0
        CMVideoFormatDescriptionGetH264ParameterSetAtIndex(
          format, parameterSetIndex: index, parameterSetPointerOut: &pointer, parameterSetSizeOut: &size,
          parameterSetCountOut: nil, nalUnitHeaderLengthOut: nil)
        guard let pointer else { continue }
        payload.append(contentsOf: startCode)
        payload.append(pointer, count: size)
      }
    }

    guard let block = CMSampleBufferGetDataBuffer(sample) else { return }
    var length = 0
    var pointer: UnsafeMutablePointer<CChar>?
    CMBlockBufferGetDataPointer(
      block, atOffset: 0, lengthAtOffsetOut: nil, totalLengthOut: &length, dataPointerOut: &pointer)
    guard let pointer else { return }
    // O VideoToolbox entrega AVCC (NALs prefixadas pelo tamanho); a webview espera Annex B.
    var offset = 0
    while offset + 4 <= length {
      let raw = UnsafeRawPointer(pointer + offset)
      let nalLength = Int(UInt32(bigEndian: raw.loadUnaligned(as: UInt32.self)))
      guard offset + 4 + nalLength <= length else { break }
      payload.append(contentsOf: startCode)
      payload.append(raw.assumingMemoryBound(to: UInt8.self) + 4, count: nalLength)
      offset += 4 + nalLength
    }
    output.write(.video, payload)
  }
}
