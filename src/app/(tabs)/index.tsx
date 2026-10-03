import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { MapSheet } from '@/components/map-sheet';
import { MapProfileButton } from '@/components/map-profile-button';
import { MapboxMap } from '@/components/mapbox-map';
import type { Place } from '@/lib/mapbox';

export default function MapScreen() {
  const { height } = useWindowDimensions();
  const [place, setPlace] = useState<Place | null>(null);

  return (
    <View style={styles.container}>
      {/* Selecting a place drops the sheet to 40%, so keep the pin in the map area above it. */}
      <MapboxMap place={place} bottomPadding={height * 0.4} />
      <MapProfileButton />
      <MapSheet onSelect={setPlace} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
