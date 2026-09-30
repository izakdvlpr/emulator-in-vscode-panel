import Foundation

// ios-helper --udid <udid> --developer-dir <dir> [--owned]
//
// Ponte entre o extension host e um iOS Simulator já bootado. Comandos chegam como JSON por
// linha no stdin; vídeo, PNGs e eventos saem no stdout (ver `Output`). Com `--owned`, o fim do
// stdin (Stop ou host morto) desliga o simulador, como o `-idle-grpc-timeout` faz no Android.

struct Arguments {
  var udid = ""
  var developerDir = ""
  var owned = false

  init(_ arguments: [String]) throws {
    var iterator = arguments.dropFirst().makeIterator()
    while let argument = iterator.next() {
      switch argument {
      case "--udid": udid = iterator.next() ?? ""
      case "--developer-dir": developerDir = iterator.next() ?? ""
      case "--owned": owned = true
      default: throw HelperError("Unknown argument \(argument)")
      }
    }
    if udid.isEmpty || developerDir.isEmpty {
      throw HelperError("Usage: ios-helper --udid <udid> --developer-dir <dir> [--owned]")
    }
  }
}

struct Command: Decodable {
  let cmd: String
  var maxWidth: Int?
  var maxHeight: Int?
  var phase: String?
  var x: Double?
  var y: Double?
  var mirror: Bool?
  var name: String?
  var usage: UInt32?
  var modifiers: [UInt32]?
  var rotation: Int?
  var id: UInt32?
}

final class Helper {
  private let arguments: Arguments
  private let output: Output
  private let simulator: Simulator
  private let input: Input
  // Comandos são aplicados em ordem numa fila só; o encoder e o input têm filas próprias.
  private let queue = DispatchQueue(label: "commands")
  private var rotation = Rotation.portrait
  private var encoder: VideoEncoder?
  private var viewport: (width: Int, height: Int)?
  private var exiting = false

  init(arguments: Arguments, output: Output) throws {
    self.arguments = arguments
    self.output = output
    simulator = try Simulator(udid: arguments.udid, developerDir: arguments.developerDir)
    input = try Input(simulator: simulator)
  }

  func run() {
    let surface = simulator.surface
    output.event(["event": "ready", "width": surface.width, "height": surface.height])
    watchState()
    Thread.detachNewThread { [self] in readCommands() }
  }

  private func readCommands() {
    let decoder = JSONDecoder()
    while let line = readLine() {
      guard !line.isEmpty else { continue }
      do {
        let command = try decoder.decode(Command.self, from: Data(line.utf8))
        queue.async { [self] in handle(command) }
      } catch {
        log("invalid command: \(line)")
      }
    }
    queue.async { [self] in finish(shutdown: arguments.owned) }
  }

  private func handle(_ command: Command) {
    guard !exiting else { return }
    do {
      switch command.cmd {
      case "stream":
        viewport = (command.maxWidth ?? 0, command.maxHeight ?? 0)
        try restartStream()
      case "stopStream":
        viewport = nil
        encoder?.stop()
        encoder = nil
      case "touch":
        input.touch(
          phase: command.phase ?? "", x: clamp(command.x), y: clamp(command.y), mirror: command.mirror ?? false)
      case "button":
        input.pressButton(command.name ?? "")
      case "key":
        guard let usage = command.usage else { throw HelperError("key without usage") }
        input.key(usage: usage, modifiers: command.modifiers ?? [])
      case "rotate":
        guard let value = command.rotation, let next = Rotation(rawValue: ((value % 4) + 4) % 4) else {
          throw HelperError("rotate without rotation")
        }
        rotation = next
        input.rotate(to: next)
        if viewport != nil { try restartStream() }
      case "screenshot":
        guard let id = command.id else { throw HelperError("screenshot without id") }
        var payload = Data()
        payload.appendBigEndian(id)
        do {
          payload.append(try screenshot(simulator: simulator, rotation: rotation))
          output.write(.png, payload)
        } catch {
          output.event(["event": "screenshotFailed", "id": id, "message": "\(error)"])
        }
      default:
        throw HelperError("unknown command \(command.cmd)")
      }
    } catch {
      log("\(command.cmd) failed: \(error)")
      output.event(["event": "error", "message": "\(error)"])
    }
  }

  private func restartStream() throws {
    encoder?.stop()
    encoder = nil
    guard let viewport else { return }
    let next = try VideoEncoder(
      simulator: simulator, output: output, rotation: rotation, maxWidth: viewport.width, maxHeight: viewport.height)
    next.start()
    encoder = next
  }

  /// O CoreSimulator não avisa quando o device desliga por fora (Simulator.app, `simctl shutdown`);
  /// o framebuffer só para de mudar. Por isso o estado é conferido periodicamente.
  private func watchState() {
    queue.asyncAfter(deadline: .now() + 2) { [self] in
      guard !exiting else { return }
      if simulator.state != "Booted" {
        output.event(["event": "exited"])
        finish(shutdown: false)
      } else {
        watchState()
      }
    }
  }

  func finish(shutdown: Bool) {
    guard !exiting else { return }
    exiting = true
    encoder?.stop()
    encoder = nil
    if shutdown { shutdownSimulator() }
    output.drain()
    exit(0)
  }

  private func shutdownSimulator() {
    let process = Process()
    process.executableURL = URL(fileURLWithPath: "/usr/bin/xcrun")
    process.arguments = ["simctl", "shutdown", arguments.udid]
    var environment = ProcessInfo.processInfo.environment
    environment["DEVELOPER_DIR"] = arguments.developerDir
    process.environment = environment
    do {
      try process.run()
      process.waitUntilExit()
    } catch {
      log("simctl shutdown failed: \(error)")
    }
  }

  func terminate() {
    queue.async { [self] in finish(shutdown: arguments.owned) }
  }
}

private func clamp(_ value: Double?) -> Double {
  min(max(value ?? 0, 0), 1)
}

// Escrever num pipe fechado não deve matar o processo antes do shutdown do simulador.
signal(SIGPIPE, SIG_IGN)

let output = Output()
let helper: Helper
do {
  helper = try Helper(arguments: try Arguments(CommandLine.arguments), output: output)
} catch {
  log("\(error)")
  output.event(["event": "error", "message": "\(error)"])
  output.drain()
  exit(1)
}

// SIGTERM vira o mesmo caminho do fim do stdin, para um simulador `--owned` não ficar ligado.
signal(SIGTERM, SIG_IGN)
let termination = DispatchSource.makeSignalSource(signal: SIGTERM, queue: .main)
termination.setEventHandler { helper.terminate() }
termination.resume()

helper.run()
dispatchMain()
