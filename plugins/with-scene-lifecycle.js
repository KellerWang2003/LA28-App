// iOS 27 refuses to launch apps that don't use the UIScene life cycle, but the SDK 57 prebuild
// template still creates the window in the AppDelegate. This plugin switches the generated
// project over to Expo's own `ExpoAppSceneDelegate` (expo/ios/AppDelegates/ExpoAppSceneDelegate.swift).
// Remove it once the Expo template adopts scenes by default.
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

const WINDOW_SETUP = `#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

`;

function withSceneInfoPlist(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: 'EXExpoAppSceneDelegate',
          },
        ],
      },
    };
    return config;
  });
}

function withSceneAppDelegate(config) {
  return withAppDelegate(config, (config) => {
    if (config.modResults.language !== 'swift') {
      throw new Error('with-scene-lifecycle only supports a Swift AppDelegate.');
    }
    let contents = config.modResults.contents;

    if (!contents.includes('ExpoReactNativeFactoryProvider')) {
      contents = contents.replace(
        'class AppDelegate: ExpoAppDelegate {',
        'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
      );
    }
    // The scene delegate creates the window and starts React Native instead.
    contents = contents.replace(WINDOW_SETUP, '');

    if (!contents.includes('ExpoReactNativeFactoryProvider') || contents.includes(WINDOW_SETUP)) {
      throw new Error(
        'with-scene-lifecycle: AppDelegate.swift no longer matches the expected template; update the plugin.'
      );
    }
    config.modResults.contents = contents;
    return config;
  });
}

module.exports = function withSceneLifecycle(config) {
  return withSceneAppDelegate(withSceneInfoPlist(config));
};
