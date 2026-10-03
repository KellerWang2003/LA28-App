import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { openProfile, ProfileIcon } from './profile-button';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Android and web version of the profile button floating over the map (iOS: map-profile-button.ios.tsx).
export function MapProfileButton() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={openProfile}
      accessibilityRole="button"
      accessibilityLabel="Profile"
      style={({ pressed }) => [styles.position, { top: insets.top + Spacing.two }, pressed && styles.pressed]}>
      <ThemedView type="backgroundElement" style={styles.circle}>
        <SymbolView
          name={{ android: ProfileIcon.material, web: ProfileIcon.material }}
          tintColor={theme.text}
          size={26}
        />
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    right: Spacing.three,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
  },
  pressed: {
    opacity: 0.7,
  },
});
