import { useEffect, useRef, useState } from 'react';

import { Venues } from '@/data/venues';
import {
  createSearchSession,
  retrievePlace,
  suggestPlaces,
  type Place,
  type PlaceSuggestion,
} from '@/lib/mapbox';

export type SheetItem = PlaceSuggestion & { place?: Place };

// Search state shared by both map sheet versions. With an empty query the list shows venues;
// otherwise it shows Mapbox suggestions, which are resolved to a location when chosen.
export function usePlaceSearch() {
  const session = useRef(createSearchSession());
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);

  useEffect(() => {
    const text = query.trim();
    if (!text) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      suggestPlaces(text, session.current, controller.signal)
        .then(setSuggestions)
        .catch((error) => {
          if (!controller.signal.aborted) console.warn(error);
        });
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const isSearching = query.trim().length > 0;
  const items: SheetItem[] = isSearching
    ? suggestions
    : Venues.map((venue) => ({ id: venue.id, name: venue.name, address: venue.address, place: venue }));

  const resolve = async (item: SheetItem): Promise<Place> => {
    if (item.place) return item.place;
    const place = await retrievePlace(item, session.current);
    // Retrieving a place ends the billing session, so the next search starts a new one.
    session.current = createSearchSession();
    return place;
  };

  return {
    query,
    setQuery,
    items,
    title: isSearching ? 'Results' : 'Venues',
    resolve,
  };
}
