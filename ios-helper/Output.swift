import Foundation

/// Canal com o extension host. Cada mensagem no stdout é `[tipo u8][tamanho u32 BE][payload]`;
/// sem esse envelope, JSON e vídeo binário não poderiam dividir o mesmo pipe.
final class Output {
  enum Kind: UInt8 {
    case event = 0x4A  // "J"
    case video = 0x56  // "V"
    case png = 0x50  // "P"
  }

  // Frames chegam de threads diferentes (callback do VideoToolbox, fila de comandos); a fila
  // serial impede que dois envelopes se intercalem no pipe.
  private let queue = DispatchQueue(label: "output")

  func event(_ fields: [String: Any]) {
    guard let data = try? JSONSerialization.data(withJSONObject: fields) else { return }
    write(.event, data)
  }

  func write(_ kind: Kind, _ payload: Data) {
    var header = Data([kind.rawValue])
    header.appendBigEndian(UInt32(payload.count))
    queue.async {
      Output.writeAll(header)
      Output.writeAll(payload)
    }
  }

  /// Espera o que já foi enfileirado chegar ao pipe (antes de `exit`).
  func drain() {
    queue.sync {}
  }

  private static func writeAll(_ data: Data) {
    data.withUnsafeBytes { raw in
      guard var pointer = raw.baseAddress else { return }
      var remaining = raw.count
      while remaining > 0 {
        let written = Darwin.write(STDOUT_FILENO, pointer, remaining)
        if written < 0 {
          if errno == EINTR { continue }
          // O host fechou o pipe: não há mais ninguém para receber.
          exit(0)
        }
        pointer += written
        remaining -= written
      }
    }
  }
}

func log(_ message: String) {
  FileHandle.standardError.write(Data("\(message)\n".utf8))
}

extension Data {
  mutating func appendBigEndian<T: FixedWidthInteger>(_ value: T) {
    Swift.withUnsafeBytes(of: value.bigEndian) { append(contentsOf: $0) }
  }
}

struct HelperError: Error, CustomStringConvertible {
  let description: String
  init(_ description: String) { self.description = description }
}
