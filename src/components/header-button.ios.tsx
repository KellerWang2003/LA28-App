import { Stack } from 'expo-router';

import type { HeaderButtonProps } from './header-button';

// A native bar button item on the right of the screen's header (UIBarButtonItem via Stack.Toolbar).
export function HeaderButton({ icon, label, onPress }: HeaderButtonProps) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Button icon={icon.ios} accessibilityLabel={label} onPress={onPress} />
    </Stack.Toolbar>
  );
}
