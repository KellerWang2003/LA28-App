import type { Place } from '@/lib/mapbox';

// Sample list of LA-area venues for the map sheet; swap for real LA28 venue data later.
// Coordinates come from Mapbox search.
export const Venues: Place[] = [
  { id: 'sofi-stadium', name: 'SoFi Stadium', address: 'Inglewood', coordinate: [-118.33903, 33.9534] },
  { id: 'la-memorial-coliseum', name: 'LA Memorial Coliseum', address: 'Exposition Park', coordinate: [-118.28785, 34.01398] },
  { id: 'crypto-com-arena', name: 'Crypto.com Arena', address: 'Downtown LA', coordinate: [-118.26706, 34.04315] },
  { id: 'intuit-dome', name: 'Intuit Dome', address: 'Inglewood', coordinate: [-118.34223, 33.9438] },
  { id: 'rose-bowl', name: 'Rose Bowl Stadium', address: 'Pasadena', coordinate: [-118.16766, 34.16131] },
  { id: 'dodger-stadium', name: 'Dodger Stadium', address: 'Elysian Park', coordinate: [-118.24004, 34.07397] },
  { id: 'pauley-pavilion', name: 'Pauley Pavilion', address: 'Westwood', coordinate: [-118.44689, 34.0704] },
  { id: 'galen-center', name: 'Galen Center', address: 'University Park', coordinate: [-118.28001, 34.02088] },
  { id: 'peacock-theater', name: 'Peacock Theater', address: 'Downtown LA', coordinate: [-118.26705, 34.0444] },
  { id: 'honda-center', name: 'Honda Center', address: 'Anaheim', coordinate: [-117.87651, 33.80778] },
  { id: 'long-beach-convention-center', name: 'Long Beach Convention Center', address: 'Long Beach', coordinate: [-118.19147, 33.76469] },
  { id: 'dignity-health-sports-park', name: 'Dignity Health Sports Park', address: 'Carson', coordinate: [-118.26117, 33.86438] },
];
