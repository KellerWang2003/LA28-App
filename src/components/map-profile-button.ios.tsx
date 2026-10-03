import { Button, Host } from '@expo/ui/swift-ui';
import { buttonBorderShape, buttonStyle, controlSize, labelStyle } from '@expo/ui/swift-ui/modifiers';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { openProfile, ProfileIcon } from './profile-button';

import { Spacing } from '@/constants/theme';

// The Map tab has no header, so its profile button floats over the map: a SwiftUI glass button.
export function MapProfileButton() {
  const insets = useSafeAreaInsets();

  return (
    <Host matchContents style={[styles.position, { top: insets.top + Spacing.two }]}>
      <Button
        systemImage={ProfileIcon.ios}
        label="Profile"
        onPress={openProfile}
        modifiers={[labelStyle('iconOnly'), buttonStyle('glass'), buttonBorderShape('circle'), controlSize('large')]}
      />
    </Host>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    right: Spacing.three,
  },
});
