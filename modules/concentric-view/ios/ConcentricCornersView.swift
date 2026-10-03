import ExpoModulesCore
import UIKit

// Clips its children to fixed top corners and bottom corners that are concentric with the screen's
// (UICornerRadius.containerConcentric), so the curve stays parallel to the screen edge at any inset.
// With `glass`, it also draws a Liquid Glass background beneath its children.
public final class ConcentricCornersView: ExpoView {
  var topRadius: Double = 0 {
    didSet { updateCorners() }
  }

  var glass = false {
    didSet { setNeedsLayout() }
  }

  private var glassView: UIVisualEffectView?

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    updateCorners()
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    // React Native resets clipping and the layer's corners from the `overflow` and `borderRadius`
    // styles when it updates props, so reapply both after each layout pass.
    clipsToBounds = true
    updateCorners()

    // Like expo-glass-effect, create the glass effect during layout; created earlier it can fail to render.
    if glass, glassView == nil, window != nil, #available(iOS 26.0, *) {
      let effectView = UIVisualEffectView(effect: UIGlassEffect(style: .regular))
      effectView.frame = bounds
      effectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
      insertSubview(effectView, at: 0)
      glassView = effectView
      updateCorners()
    } else if !glass, let effectView = glassView {
      effectView.removeFromSuperview()
      glassView = nil
    }
  }

  private func updateCorners() {
    guard #available(iOS 26.0, *) else {
      return
    }
    let corners = UICornerConfiguration.uniformEdges(
      topRadius: .fixed(topRadius),
      bottomRadius: .containerConcentric()
    )
    cornerConfiguration = corners
    glassView?.cornerConfiguration = corners
  }

  // Keep React Native children above the glass view, which sits at index 0 once created.
  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    insertSubview(childComponentView, at: index + (glassView == nil ? 0 : 1))
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    childComponentView.removeFromSuperview()
  }
}
