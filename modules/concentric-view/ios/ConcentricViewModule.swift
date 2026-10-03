import ExpoModulesCore

public final class ConcentricViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ConcentricView")

    // Concentric corners (UICornerRadius.containerConcentric) need iOS 26.
    Constant("isSupported") { () -> Bool in
      if #available(iOS 26.0, *) {
        return true
      }
      return false
    }

    View(ConcentricCornersView.self) {
      Prop("glass", false) { (view, glass: Bool) in
        view.glass = glass
      }

      Prop("topRadius", 0.0) { (view, topRadius: Double) in
        view.topRadius = topRadius
      }
    }
  }
}
