export const MapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';

// Swap for the designer's Mapbox Studio style URL (mapbox://styles/<account>/<style-id>) when it's ready.
export const MapStyleURL = 'mapbox://styles/mapbox/standard';

// [longitude, latitude], the order Mapbox expects everywhere.
export type Coordinate = [number, number];

export const LosAngeles: Coordinate = [-118.2437, 34.0522];

export type Place = {
  id: string;
  name: string;
  address?: string;
  coordinate: Coordinate;
};

export type PlaceSuggestion = {
  id: string;
  name: string;
  address?: string;
};

// Mapbox Search Box API: `suggest` returns type-ahead results and `retrieve` resolves one to a location.
// Calls that share a session token are billed as one search session.
// https://docs.mapbox.com/api/search/search-box/
const SearchBoxURL = 'https://api.mapbox.com/search/searchbox/v1';

export function createSearchSession() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

export async function suggestPlaces(query: string, session: string, signal?: AbortSignal) {
  const params = new URLSearchParams({
    q: query,
    proximity: LosAngeles.join(','),
    language: 'en',
    limit: '6',
    session_token: session,
    access_token: MapboxToken,
  });
  const response = await fetch(`${SearchBoxURL}/suggest?${params}`, { signal });
  if (!response.ok) throw new Error(`Mapbox suggest failed: ${response.status}`);
  const body: {
    suggestions: { mapbox_id: string; name: string; full_address?: string; place_formatted?: string }[];
  } = await response.json();

  return body.suggestions.map<PlaceSuggestion>((suggestion) => ({
    id: suggestion.mapbox_id,
    name: suggestion.name,
    address: suggestion.full_address ?? suggestion.place_formatted,
  }));
}

export async function retrievePlace(suggestion: PlaceSuggestion, session: string): Promise<Place> {
  const params = new URLSearchParams({ session_token: session, access_token: MapboxToken });
  const response = await fetch(`${SearchBoxURL}/retrieve/${suggestion.id}?${params}`);
  if (!response.ok) throw new Error(`Mapbox retrieve failed: ${response.status}`);
  const body: { features: { geometry: { coordinates: Coordinate } }[] } = await response.json();

  return { ...suggestion, coordinate: body.features[0].geometry.coordinates };
}
