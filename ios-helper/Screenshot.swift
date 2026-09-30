import CoreGraphics
import Foundation
import ImageIO
import VideoToolbox

/// PNG em resolução real, já na orientação da tela.
func screenshot(simulator: Simulator, rotation: Rotation) throws -> Data {
  guard let source = pixelBuffer(from: simulator.surface), let frame = PixelRotator(rotation: rotation).rotate(source)
  else {
    throw HelperError("Could not read the framebuffer")
  }
  var image: CGImage?
  let status = VTCreateCGImageFromCVPixelBuffer(frame, options: nil, imageOut: &image)
  guard status == noErr, let image else { throw HelperError("Could not convert the framebuffer: \(status)") }

  let data = NSMutableData()
  guard let destination = CGImageDestinationCreateWithData(data as CFMutableData, "public.png" as CFString, 1, nil)
  else {
    throw HelperError("Could not create the PNG encoder")
  }
  CGImageDestinationAddImage(destination, image, nil)
  guard CGImageDestinationFinalize(destination) else { throw HelperError("Could not encode the PNG") }
  return data as Data
}
