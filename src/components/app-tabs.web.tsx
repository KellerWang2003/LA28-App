import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps, TabListProps } from 'expo-router/ui';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Web mirrors the mobile app: a floating tab bar pinned to the bottom of the screen.
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="map">Map</TabButton>
          </TabTrigger>
          <TabTrigger name="events" href="/events" asChild>
            <TabButton icon="event">Events</TabButton>
          </TabTrigger>
          <TabTrigger name="sports" href="/sports" asChild>
            <TabButton icon="sports">Sports</TabButton>
          </TabTrigger>
          <TabTrigger name="people" href="/people" asChild>
            <TabButton icon="group">People</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  icon: NonNullable<Extract<SymbolViewProps['name'], object>['web']>;
};

export function TabButton({ children, isFocused, icon, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.text : theme.textSecondary;

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <SymbolView name={{ web: icon }} tintColor={color} size={22} />
        <ThemedText type="smallBold" style={{ color }}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[styles.tabListContainer, { paddingBottom: insets.bottom + Spacing.three }]}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 420,
    padding: Spacing.one,
    borderRadius: Spacing.six,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  },
  tabButton: {
    flex: 1,
  },
  tabButtonView: {
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.six,
  },
  pressed: {
    opacity: 0.7,
  },
});
