import { Stack } from 'expo-router';
import { Platform } from 'react-native';

// Stack for a tab that shows a native header: a large title on the left that shrinks on scroll (iOS),
// or a left-aligned title (Android and web).
export function TabStack({ title }: { title: string }) {
  return (
    <Stack
      screenOptions={{
        headerLargeTitleEnabled: true,
        headerTransparent: Platform.OS === 'ios',
        headerTitleAlign: 'left',
        // Web headers have no large title, so match its size there.
        headerTitleStyle: Platform.OS === 'web' ? { fontSize: 28, fontWeight: '700' } : undefined,
      }}>
      <Stack.Screen name="index" options={{ title }} />
    </Stack>
  );
}
