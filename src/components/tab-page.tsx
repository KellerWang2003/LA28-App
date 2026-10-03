import { Platform, ScrollView, StyleSheet } from 'react-native';

import { ProfileHeaderButton } from './profile-button';

import { BottomTabInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Empty page for a tab with a header. Content scrolls under the large title so it can shrink on scroll.
export function TabPage() {
  const theme = useTheme();

  return (
    <>
      <ProfileHeaderButton />
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    // Enough height to scroll on iOS, so the large title's shrink-on-scroll behaviour can be seen.
    minHeight: Platform.OS === 'ios' ? '110%' : undefined,
    paddingBottom: BottomTabInset,
  },
});
