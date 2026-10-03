import { SymbolView } from 'expo-symbols';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Web stand-in for the native modal sheet: a full-height page that slides up over a dimmed backdrop.
// Closes with the X button, a click on the backdrop, or the Escape key.
export function WebSheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const theme = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <View style={styles.overlay}>
      <Animated.View entering={FadeIn.duration(200)} style={[StyleSheet.absoluteFill, styles.backdrop]}>
        <Pressable accessibilityLabel={`Close ${title}`} onPress={onClose} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <Animated.View entering={SlideInDown.duration(300)} role="dialog" aria-label={title} style={styles.sheet}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="subtitle">{title}</ThemedText>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={({ pressed }) => [styles.close, { backgroundColor: theme.backgroundElement }, pressed && styles.pressed]}>
              <SymbolView name={{ web: 'close' }} tintColor={theme.text} size={20} />
            </Pressable>
          </View>
          {children}
        </ThemedView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    height: '94%',
  },
  content: {
    flex: 1,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
