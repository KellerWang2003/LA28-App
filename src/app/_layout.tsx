import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

// Opening /profile directly still puts the tabs underneath it.
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile"
            options={{
              title: 'Profile',
              // Native: a full-height sheet that slides up from the bottom. Web has no native modal, so the
              // route renders transparently over the tabs and WebSheet draws the sheet itself.
              presentation: Platform.select({ web: 'transparentModal', default: 'modal' }),
              animation: Platform.select({ web: 'none', default: undefined }),
              headerShown: Platform.OS !== 'web',
              headerLargeTitleEnabled: true,
              headerTransparent: Platform.OS === 'ios',
              headerTitleAlign: 'left',
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
