import { router } from 'expo-router';

import { HeaderButton } from './header-button';

export const ProfileIcon = { ios: 'person.crop.circle', material: 'account_circle' } as const;

// `navigate` rather than `push`, so repeated taps can't stack several profile sheets.
export function openProfile() {
  router.navigate('/profile');
}

export function closeProfile() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

// Profile button for the right side of a screen's header.
export function ProfileHeaderButton() {
  return <HeaderButton icon={ProfileIcon} label="Profile" onPress={openProfile} />;
}
