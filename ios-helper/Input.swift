import CoreGraphics
import Foundation
import ObjectiveC

/// Toque, botões, teclado e rotação. Tudo roda numa fila serial: as mensagens Indigo precisam
/// chegar ao simulador na ordem em que foram geradas.
final class Input {
  private typealias SendFn = @convention(c) (
    AnyObject, Selector, UnsafeMutableRawPointer, Bool, DispatchQueue?, (@convention(block) (NSError?) -> Void)?
  ) -> Void
  private typealias MouseFn = @convention(c) (
    UnsafeMutablePointer<CGPoint>, UnsafeMutablePointer<CGPoint>?, UInt32, Int, Int, CGFloat, CGFloat
  ) -> UnsafeMutableRawPointer?
  private typealias ButtonFn = @convention(c) (UInt32, UInt32, UInt32) -> UnsafeMutableRawPointer?
  private typealias ArbitraryFn = @convention(c) (UInt32, UInt32, UInt32, UInt32) -> UnsafeMutableRawPointer?
  private typealias KeyFn = @convention(c) (UInt32, UInt32) -> UnsafeMutableRawPointer?

  private let client: AnyObject
  private let sendFn: SendFn
  private let sendSel = NSSelectorFromString("sendWithMessage:freeWhenDone:completionQueue:completion:")
  private let mouse: MouseFn
  private let button: ButtonFn
  private let arbitrary: ArbitraryFn
  private let keyboard: KeyFn
  private let purplePort: mach_port_t
  private let queue = DispatchQueue(label: "input")

  private var pendingMove: (x: Double, y: Double, mirror: Bool)?
  private var retryScheduled = false

  // Valores do enum interno do SimulatorKit (vistos no disassembly e confirmados no spike).
  private static let touchTarget: UInt32 = 0x32
  private static let buttonTarget: UInt32 = 0x33
  private static let down: UInt32 = 1
  private static let up: UInt32 = 2
  // `IndigoHIDMessageForMouseNSEvent` devolve NULL para eventos com menos de 16ms entre si.
  private static let throttleMicroseconds: useconds_t = 17_000

  init(simulator: Simulator) throws {
    guard let hidClass = NSClassFromString("_TtC12SimulatorKit24SimDeviceLegacyHIDClient") as? NSObject.Type,
      let allocated = hidClass.perform(NSSelectorFromString("alloc"))?.takeUnretainedValue()
    else {
      throw HelperError("SimDeviceLegacyHIDClient not found")
    }
    typealias InitFn = @convention(c) (AnyObject, Selector, AnyObject, UnsafeMutablePointer<NSError?>?) -> AnyObject?
    let initSel = NSSelectorFromString("initWithDevice:error:")
    let initFn = unsafeBitCast(method(of: hidClass, initSel), to: InitFn.self)
    var error: NSError?
    guard let client = initFn(allocated, initSel, simulator.device, &error) else {
      throw HelperError("Could not create the HID client: \(error?.localizedDescription ?? "unknown")")
    }
    self.client = client
    sendFn = unsafeBitCast(method(of: hidClass, sendSel), to: SendFn.self)
    mouse = try simulator.symbol("IndigoHIDMessageForMouseNSEvent", as: MouseFn.self)
    button = try simulator.symbol("IndigoHIDMessageForButton", as: ButtonFn.self)
    arbitrary = try simulator.symbol("IndigoHIDMessageForHIDArbitrary", as: ArbitraryFn.self)
    keyboard = try simulator.symbol("IndigoHIDMessageForKeyboardArbitrary", as: KeyFn.self)
    purplePort = try simulator.lookup("PurpleWorkspacePort")
  }

  // MARK: Toque

  /// `x`/`y` em 0..1 na orientação natural (retrato). `mirror` adiciona um segundo dedo
  /// refletido pelo centro, para pinch.
  func touch(phase: String, x: Double, y: Double, mirror: Bool) {
    queue.async { [self] in
      switch phase {
      case "down":
        pendingMove = nil
        sendTouch(type: 1, x: x, y: y, mirror: mirror, retries: 3)
      case "move":
        pendingMove = (x, y, mirror)
        flushMove()
      case "up":
        // O último move pendente perde para o up: a posição final vem nele.
        pendingMove = nil
        sendTouch(type: 2, x: x, y: y, mirror: mirror, retries: 3)
      default:
        log("unknown touch phase \(phase)")
      }
    }
  }

  private func flushMove() {
    guard let move = pendingMove else { return }
    if sendTouch(type: 6, x: move.x, y: move.y, mirror: move.mirror, retries: 0) {
      pendingMove = nil
    } else if !retryScheduled {
      retryScheduled = true
      queue.asyncAfter(deadline: .now() + .microseconds(Int(Input.throttleMicroseconds))) { [self] in
        retryScheduled = false
        flushMove()
      }
    }
  }

  @discardableResult
  private func sendTouch(type: Int, x: Double, y: Double, mirror: Bool, retries: Int) -> Bool {
    var first = CGPoint(x: x, y: y)
    var second = CGPoint(x: 1 - x, y: 1 - y)
    for attempt in 0...retries {
      if attempt > 0 { usleep(Input.throttleMicroseconds) }
      let message =
        mirror
        ? mouse(&first, &second, Input.touchTarget, type, 0, 1, 1)
        : mouse(&first, nil, Input.touchTarget, type, 0, 1, 1)
      if let message {
        send(message)
        return true
      }
    }
    return false
  }

  // MARK: Botões e teclado

  func pressButton(_ name: String) {
    queue.async { [self] in
      switch name {
      case "home": pressHardware(source: 0x0)
      case "lock": pressHardware(source: 0x1)
      case "volumeUp": pressConsumer(usage: 0xE9)
      case "volumeDown": pressConsumer(usage: 0xEA)
      case "appSwitcher":
        // Duplo clique no Home abre o app switcher, como num iPhone com botão.
        pressHardware(source: 0x0)
        usleep(150_000)
        pressHardware(source: 0x0)
      default:
        log("unknown button \(name)")
      }
    }
  }

  private func pressHardware(source: UInt32) {
    sendIfPresent(button(source, Input.down, Input.buttonTarget))
    usleep(50_000)
    sendIfPresent(button(source, Input.up, Input.buttonTarget))
  }

  /// Página 0x0C (Consumer) do HID: é por onde passam as teclas de volume.
  private func pressConsumer(usage: UInt32) {
    sendIfPresent(arbitrary(Input.buttonTarget, 0x0C, usage, Input.down))
    usleep(50_000)
    sendIfPresent(arbitrary(Input.buttonTarget, 0x0C, usage, Input.up))
  }

  /// `usage` é um HID usage da página Keyboard (0x07); `modifiers` também (ex.: 0xE1 Shift).
  func key(usage: UInt32, modifiers: [UInt32]) {
    queue.async { [self] in
      for modifier in modifiers { sendIfPresent(keyboard(modifier, Input.down)) }
      sendIfPresent(keyboard(usage, Input.down))
      sendIfPresent(keyboard(usage, Input.up))
      for modifier in modifiers.reversed() { sendIfPresent(keyboard(modifier, Input.up)) }
    }
  }

  // MARK: Rotação

  /// Avisa o SpringBoard da nova orientação pela purple port, como o menu Device → Rotate do
  /// Simulator.app. O framebuffer continua em retrato.
  func rotate(to rotation: Rotation) {
    queue.async { [self] in
      let size = 0x6C
      let message = UnsafeMutableRawPointer.allocate(byteCount: size, alignment: 8)
      defer { message.deallocate() }
      message.initializeMemory(as: UInt8.self, repeating: 0, count: size)
      message.storeBytes(of: UInt32(0x13), toByteOffset: 0x0, as: UInt32.self)  // MACH_MSG_TYPE_COPY_SEND
      message.storeBytes(of: UInt32(size), toByteOffset: 0x4, as: UInt32.self)
      message.storeBytes(of: purplePort, toByteOffset: 0x8, as: UInt32.self)
      message.storeBytes(of: UInt32(0x7B), toByteOffset: 0x14, as: UInt32.self)  // msgh_id
      message.storeBytes(of: UInt32(0x32 | 0x20000), toByteOffset: 0x18, as: UInt32.self)
      message.storeBytes(of: UInt32(4), toByteOffset: 0x48, as: UInt32.self)
      message.storeBytes(of: rotation.deviceOrientation, toByteOffset: 0x4C, as: UInt32.self)
      let result = mach_msg_send(message.assumingMemoryBound(to: mach_msg_header_t.self))
      if result != KERN_SUCCESS { log("rotate: mach_msg_send failed \(result)") }
    }
  }

  // MARK: Envio

  private func sendIfPresent(_ message: UnsafeMutableRawPointer?) {
    guard let message else {
      log("SimulatorKit returned no HID message")
      return
    }
    send(message)
  }

  /// Espera a confirmação: sem isso, mensagens em rajada podem ser entregues fora de ordem.
  private func send(_ message: UnsafeMutableRawPointer) {
    let done = DispatchSemaphore(value: 0)
    sendFn(client, sendSel, message, true, DispatchQueue.global()) { error in
      if let error { log("HID send failed: \(error.localizedDescription)") }
      done.signal()
    }
    done.wait()
  }
}
