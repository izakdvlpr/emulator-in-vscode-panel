import Foundation

// O VideoToolbox gera SPS sem VUI. Sem `bitstream_restriction`, o decoder H.264 do Chromium assume
// que pode haver reordenação (até o tamanho do DPB) e segura cada frame até chegarem outros. O
// simulador só manda frame quando a tela muda: com ela parada, o keyframe do início do stream
// nunca seria exibido, e o último frame de qualquer animação ficaria preso. Como o encoder roda
// com `AllowFrameReordering` desligado, declarar `max_num_reorder_frames = 0` é verdade e faz o
// decoder soltar cada frame na hora.
enum H264 {
  private static let highProfiles: Set<Int> = [100, 110, 122, 244, 44, 83, 86, 118, 128, 138, 139, 134, 135]

  /// SPS (NAL completa, sem start code) com `max_num_reorder_frames = 0`, ou nil para manter o original.
  static func withoutReordering(sps nal: Data) -> Data? {
    guard nal.count > 1, nal[nal.startIndex] & 0x1f == 7 else { return nil }
    var reader = BitReader(unescape(nal.dropFirst()))

    guard let profile = reader.bits(8) else { return nil }
    _ = reader.bits(16)  // constraint flags + level_idc
    _ = reader.ue()  // seq_parameter_set_id
    if highProfiles.contains(profile) {
      if reader.ue() == 3 { _ = reader.bit() }
      _ = reader.ue()
      _ = reader.ue()
      _ = reader.bit()
      // Matrizes de escala exigiriam parsear as listas; o VideoToolbox não as usa.
      guard reader.bit() == 0 else { return nil }
    }
    _ = reader.ue()  // log2_max_frame_num_minus4
    switch reader.ue() {
    case 0:
      _ = reader.ue()
    case 1:
      _ = reader.bit()
      _ = reader.ue()
      _ = reader.ue()
      for _ in 0..<(reader.ue() ?? 0) { _ = reader.ue() }
    default:
      // pic_order_cnt_type 2: a ordem de saída já é a de decodificação.
      return nil
    }
    guard let maxRefFrames = reader.ue() else { return nil }
    _ = reader.bit()
    _ = reader.ue()
    _ = reader.ue()
    if reader.bit() == 0 { _ = reader.bit() }
    _ = reader.bit()
    if reader.bit() == 1 { for _ in 0..<4 { _ = reader.ue() } }

    let vuiFlag = reader.position
    guard let hasVui = reader.bit() else { return nil }
    var writer = BitWriter()
    if hasVui == 0 {
      writer.copy(reader, upTo: vuiFlag)
      writer.bit(1)
      // aspect_ratio, overscan, video_signal_type, chroma_loc, timing, nal_hrd, vcl_hrd, pic_struct
      for _ in 0..<8 { writer.bit(0) }
    } else {
      if reader.bit() == 1, reader.bits(8) == 255 { _ = reader.bits(32) }
      if reader.bit() == 1 { _ = reader.bit() }
      if reader.bit() == 1 {
        _ = reader.bits(4)
        if reader.bit() == 1 { _ = reader.bits(24) }
      }
      if reader.bit() == 1 {
        _ = reader.ue()
        _ = reader.ue()
      }
      if reader.bit() == 1 {
        _ = reader.bits(32)
        _ = reader.bits(32)
        _ = reader.bit()
      }
      // Parâmetros de HRD são raros fora de broadcast; não vale parsear.
      guard reader.bit() == 0, reader.bit() == 0 else { return nil }
      _ = reader.bit()  // pic_struct_present_flag
      let restrictionFlag = reader.position
      guard reader.bit() == 0 else { return nil }
      writer.copy(reader, upTo: restrictionFlag)
    }
    writer.bit(1)  // bitstream_restriction_flag
    writer.bit(1)  // motion_vectors_over_pic_boundaries_flag
    writer.ue(2)  // max_bytes_per_pic_denom
    writer.ue(1)  // max_bits_per_mb_denom
    writer.ue(15)  // log2_max_mv_length_horizontal
    writer.ue(15)  // log2_max_mv_length_vertical
    writer.ue(0)  // max_num_reorder_frames
    writer.ue(max(1, maxRefFrames))  // max_dec_frame_buffering
    writer.bit(1)  // rbsp_stop_one_bit

    var result = Data([nal[nal.startIndex]])
    result.append(escape(writer.bytes()))
    return result
  }

  private static func unescape(_ data: Data) -> [UInt8] {
    var bytes: [UInt8] = []
    var zeros = 0
    for byte in data {
      if zeros >= 2 && byte == 3 {
        zeros = 0
        continue
      }
      zeros = byte == 0 ? zeros + 1 : 0
      bytes.append(byte)
    }
    return bytes
  }

  private static func escape(_ bytes: [UInt8]) -> Data {
    var data = Data()
    var zeros = 0
    for byte in bytes {
      if zeros >= 2 && byte <= 3 {
        data.append(3)
        zeros = 0
      }
      zeros = byte == 0 ? zeros + 1 : 0
      data.append(byte)
    }
    return data
  }
}

private struct BitReader {
  let bytes: [UInt8]
  private(set) var position = 0

  init(_ bytes: [UInt8]) { self.bytes = bytes }

  func bitAt(_ index: Int) -> Int { Int(bytes[index >> 3] >> (7 - UInt8(index & 7))) & 1 }

  mutating func bit() -> Int? {
    guard position < bytes.count * 8 else { return nil }
    defer { position += 1 }
    return bitAt(position)
  }

  mutating func bits(_ count: Int) -> Int? {
    var value = 0
    for _ in 0..<count {
      guard let bit = bit() else { return nil }
      value = value << 1 | bit
    }
    return value
  }

  mutating func ue() -> Int? {
    var zeros = 0
    while true {
      guard let bit = bit() else { return nil }
      if bit == 1 { break }
      zeros += 1
      if zeros > 31 { return nil }
    }
    guard let suffix = bits(zeros) else { return nil }
    return (1 << zeros) - 1 + suffix
  }
}

private struct BitWriter {
  private var bits: [UInt8] = []

  mutating func bit(_ value: Int) { bits.append(UInt8(value & 1)) }

  mutating func ue(_ value: Int) {
    let code = value + 1
    let length = Int.bitWidth - code.leadingZeroBitCount
    for _ in 1..<length { bit(0) }
    for shift in stride(from: length - 1, through: 0, by: -1) { bit(code >> shift) }
  }

  mutating func copy(_ reader: BitReader, upTo end: Int) {
    for index in 0..<end { bit(reader.bitAt(index)) }
  }

  func bytes() -> [UInt8] {
    var bytes = [UInt8](repeating: 0, count: (bits.count + 7) / 8)
    for (index, bit) in bits.enumerated() where bit == 1 {
      bytes[index >> 3] |= 0x80 >> UInt8(index & 7)
    }
    return bytes
  }
}
