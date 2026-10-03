import { ScrollView } from 'react-native';

import { HeaderButton } from '@/components/header-button';
import { closeProfile } from '@/components/profile-button';
import { WebSheet } from '@/components/web-sheet';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <WebSheet title="Profile" onClose={closeProfile}>
      <HeaderButton icon={{ ios: 'xmark', material: 'close' }} label="Close" onPress={closeProfile} />
      <ScrollView style={{ backgroundColor: theme.background }} contentInsetAdjustmentBehavior="automatic" />
    </WebSheet>
  );
}
