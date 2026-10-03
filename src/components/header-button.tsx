import { Stack } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SymbolNames = Extract<SymbolViewProps['name'], object>;

export type HeaderButtonProps = {
  icon: { ios: NonNullable<SymbolNames['ios']>; material: NonNullable<SymbolNames['android']> };
  label: string;
  onPress: () => void;
};

// Android and web: Stack.Toolbar is iOS/Android-native only and needs bundled icon images on Android,
// so these platforms use a regular header button. The iOS version is header-button.ios.tsx.
export function HeaderButton({ icon, label, onPress }: HeaderButtonProps) {
  const theme = useTheme();

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            hitSlop={Spacing.two}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <SymbolView name={{ android: icon.material, web: icon.material }} tintColor={theme.text} size={26} />
          </Pressable>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.two,
  },
  pressed: {
    opacity: 0.6,
  },
});
