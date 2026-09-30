import Foundation
import IOSurface
import ObjectiveC

/// Acesso ao simulador pelas frameworks privadas CoreSimulator e SimulatorKit, as mesmas que o
/// Simulator.app usa. Não há API pública para framebuffer ou HID; `simctl` só tira screenshot.
final class Simulator {
  let device: NSObject
  let simulatorKit: UnsafeMutableRawPointer
  private let screen: NSObject
  private let callbackId = NSUUID()
  private let surfaceLock = NSLock()
  private var currentSurface: IOSurface

  var surface: IOSurface {
    surfaceLock.lock()
    defer { surfaceLock.unlock() }
    return currentSurface
  }

  init(udid: String, developerDir: String) throws {
    guard dlopen("/Library/Developer/PrivateFrameworks/CoreSimulator.framework/CoreSimulator", RTLD_NOW) != nil else {
      throw HelperError("Could not load CoreSimulator.framework")
    }
    let kitPath = "\(developerDir)/Library/PrivateFrameworks/SimulatorKit.framework/SimulatorKit"
    guard let kit = dlopen(kitPath, RTLD_NOW) else {
      throw HelperError("Could not load SimulatorKit.framework from \(developerDir)")
    }
    simulatorKit = kit

    guard let uuid = NSUUID(uuidString: udid) else { throw HelperError("Invalid UDID: \(udid)") }
    guard let contextClass = NSClassFromString("SimServiceContext") as? NSObject.Type else {
      throw HelperError("SimServiceContext not found")
    }
    var error: NSError?
    typealias ContextFn = @convention(c) (AnyClass, Selector, NSString, UnsafeMutablePointer<NSError?>?) -> NSObject?
    let contextSel = NSSelectorFromString("sharedServiceContextForDeveloperDir:error:")
    let contextFn = unsafeBitCast(method(of: object_getClass(contextClass), contextSel), to: ContextFn.self)
    guard let context = contextFn(contextClass, contextSel, developerDir as NSString, &error) else {
      throw HelperError("Could not open the CoreSimulator service: \(error?.localizedDescription ?? "unknown")")
    }
    typealias SetFn = @convention(c) (NSObject, Selector, UnsafeMutablePointer<NSError?>?) -> NSObject?
    let setSel = NSSelectorFromString("defaultDeviceSetWithError:")
    let setFn = unsafeBitCast(method(of: object_getClass(context), setSel), to: SetFn.self)
    guard let deviceSet = setFn(context, setSel, &error),
      let devices = deviceSet.value(forKey: "devicesByUDID") as? [NSUUID: NSObject],
      let device = devices[uuid]
    else {
      throw HelperError("Simulator \(udid) not found")
    }
    self.device = device

    // Logo depois do `simctl bootstatus`, um simulador headless ainda pode estar sem a tela.
    let deadline = Date().addingTimeInterval(Simulator.screenTimeout)
    var found = try Simulator.findScreen(of: device)
    while found == nil {
      guard Date() < deadline else { throw HelperError("The simulator has no framebuffer (is it booted?)") }
      // Roda o run loop em vez de dormir: as atualizações do device chegam por ele.
      RunLoop.current.run(until: Date().addingTimeInterval(0.25))
      found = try Simulator.findScreen(of: device)
    }
    guard let (screen, surface) = found else { throw HelperError("The simulator has no framebuffer") }
    self.screen = screen
    currentSurface = surface
  }

  private static let screenTimeout: TimeInterval = 30

  private static func findScreen(of device: NSObject) throws -> (NSObject, IOSurface)? {
    guard let io = device.perform(NSSelectorFromString("io"))?.takeUnretainedValue() as? NSObject,
      let ports = io.perform(NSSelectorFromString("ioPorts"))?.takeUnretainedValue() as? [NSObject],
      let screenProtocol = objc_getProtocol("SimScreen")
    else {
      throw HelperError("Could not read the simulator I/O ports")
    }
    // O device pode expor mais de uma `SimScreen` e a ordem muda entre boots; só a tela principal
    // tem framebuffer.
    let screens = ports
      .compactMap { $0.perform(NSSelectorFromString("descriptor"))?.takeUnretainedValue() as? NSObject }
      .filter { class_conformsToProtocol(object_getClass($0), screenProtocol) }
    for screen in screens {
      if let surface = screen.perform(NSSelectorFromString("framebufferSurface"))?.takeUnretainedValue() as? IOSurface {
        return (screen, surface)
      }
    }
    return nil
  }

  var state: String {
    (device.perform(NSSelectorFromString("stateString"))?.takeUnretainedValue() as? String) ?? "Unknown"
  }

  /// `onFrame` só dispara quando a tela muda: tela parada não gera frames.
  func observeScreen(queue: DispatchQueue, onFrame: @escaping () -> Void) {
    typealias RegisterFn = @convention(c) (
      NSObject, Selector, NSUUID, DispatchQueue,
      @escaping @convention(block) () -> Void,
      @escaping @convention(block) (AnyObject?) -> Void,
      @escaping @convention(block) (AnyObject?) -> Void
    ) -> Void
    let sel = NSSelectorFromString(
      "registerScreenCallbacksWithUUID:callbackQueue:frameCallback:surfacesChangedCallback:propertiesChangedCallback:")
    let register = unsafeBitCast(method(of: object_getClass(screen), sel), to: RegisterFn.self)
    register(
      screen, sel, callbackId, queue, onFrame,
      { [weak self] surface in
        guard let self, let surface = surface as? IOSurface else { return }
        self.surfaceLock.lock()
        self.currentSurface = surface
        self.surfaceLock.unlock()
        onFrame()
      },
      { _ in })
  }

  func stopObservingScreen() {
    typealias UnregisterFn = @convention(c) (NSObject, Selector, NSUUID) -> Void
    let sel = NSSelectorFromString("unregisterScreenCallbacksWithUUID:")
    let unregister = unsafeBitCast(method(of: object_getClass(screen), sel), to: UnregisterFn.self)
    unregister(screen, sel, callbackId)
  }

  /// Porta Mach de um serviço dentro do simulador (ex.: `PurpleWorkspacePort`).
  func lookup(_ service: String) throws -> mach_port_t {
    typealias LookupFn = @convention(c) (NSObject, Selector, NSString, UnsafeMutablePointer<NSError?>?) -> mach_port_t
    let sel = NSSelectorFromString("lookup:error:")
    let lookup = unsafeBitCast(method(of: object_getClass(device), sel), to: LookupFn.self)
    var error: NSError?
    let port = lookup(device, sel, service as NSString, &error)
    guard port != MACH_PORT_NULL else {
      throw HelperError("Could not find \(service): \(error?.localizedDescription ?? "unknown")")
    }
    return port
  }

  func symbol<T>(_ name: String, as type: T.Type) throws -> T {
    guard let pointer = dlsym(simulatorKit, name) else { throw HelperError("\(name) not found in SimulatorKit") }
    return unsafeBitCast(pointer, to: type)
  }
}

/// IMP de um seletor. As chamadas com `NSError **` ou blocos não passam pelo `perform(_:)`,
/// então viram chamadas C com a assinatura exata do método.
func method(of cls: AnyClass?, _ sel: Selector) -> IMP {
  guard let cls, let imp = class_getMethodImplementation(cls, sel) else {
    log("missing method \(NSStringFromSelector(sel))")
    exit(1)
  }
  return imp
}
