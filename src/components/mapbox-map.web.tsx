import 'mapbox-gl/dist/mapbox-gl.css';

import type { Map as MapboxGLMap, Marker as MapboxGLMarker } from 'mapbox-gl';
import { useEffect, useRef } from 'react';

import { LosAngeles, MapboxToken, MapStyleURL, type Place } from '@/lib/mapbox';

type MapboxModule = typeof import('mapbox-gl').default;

// Web counterpart of mapbox-map.tsx, built on Mapbox GL JS.
type Props = {
  place: Place | null;
  // Space covered by UI at the bottom of the map; a selected place is centered above it.
  bottomPadding?: number;
};

export function MapboxMap({ place, bottomPadding = 0 }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapbox = useRef<MapboxModule | null>(null);
  const map = useRef<MapboxGLMap | null>(null);
  const marker = useRef<MapboxGLMarker | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Loaded lazily because Mapbox GL needs `window`, which doesn't exist during static rendering.
    import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !container.current) return;
      mapbox.current = mapboxgl;
      mapboxgl.accessToken = MapboxToken;

      const instance = new mapboxgl.Map({
        container: container.current,
        style: MapStyleURL,
        center: LosAngeles,
        zoom: 10,
        // The sheet covers the bottom of the map and the profile button sits top right, so the logo and
        // controls stack at the top left.
        logoPosition: 'top-left',
        attributionControl: false,
      });
      instance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'top-left');
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      });
      instance.addControl(geolocate, 'top-left');
      instance.on('load', () => geolocate.trigger());
      map.current = instance;
    });

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapbox.current) return;
    marker.current?.remove();
    marker.current = null;
    if (!place) return;

    marker.current = new mapbox.current.Marker({ color: '#E5484D' })
      .setLngLat(place.coordinate)
      .addTo(map.current);
    map.current.flyTo({ center: place.coordinate, zoom: 15, duration: 1500, padding: { top: 0, left: 0, right: 0, bottom: bottomPadding } });
  }, [place, bottomPadding]);

  // `isolation` keeps Mapbox's z-indexed controls from stacking above the sheet.
  return <div ref={container} style={{ position: 'absolute', inset: 0, isolation: 'isolate' }} />;
}
