import Mapbox, { Camera, LocationPuck, MapView, PointAnnotation } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LosAngeles, MapboxToken, MapStyleURL, type Place } from '@/lib/mapbox';

Mapbox.setAccessToken(MapboxToken);

type Props = {
  place: Place | null;
  // Space covered by UI at the bottom of the map; a selected place is centered above it.
  bottomPadding?: number;
};

export function MapboxMap({ place, bottomPadding = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const [showsUserLocation, setShowsUserLocation] = useState(false);
  // The sheet covers the bottom of the map and the profile button sits top right, so the Mapbox logo
  // and attribution button stack at the top left.
  const ornamentTop = insets.top + 8;

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ granted }) => setShowsUserLocation(granted));
  }, []);

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      styleURL={MapStyleURL}
      scaleBarEnabled={false}
      logoPosition={{ top: ornamentTop, left: 16 }}
      attributionPosition={{ top: ornamentTop + 32, left: 16 }}>
      <Camera
        defaultSettings={{ centerCoordinate: LosAngeles, zoomLevel: 10 }}
        centerCoordinate={place?.coordinate}
        zoomLevel={place ? 15 : undefined}
        padding={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: place ? bottomPadding : 0 }}
        animationMode="flyTo"
        animationDuration={1500}
      />
      {showsUserLocation && <LocationPuck pulsing={{ isEnabled: true }} />}
      {place && (
        <PointAnnotation key={place.id} id={place.id} coordinate={place.coordinate} title={place.name}>
          <View style={styles.marker} />
        </PointAnnotation>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: '#E5484D',
  },
});
