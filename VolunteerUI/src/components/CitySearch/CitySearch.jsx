import React, { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../../utils/loadGoogleMaps';  // adjust path as needed

function CitySearch({ onSelect }) {
  const inputRef = useRef();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_GEOCODE_API_KEY;
    loadGoogleMaps(apiKey, () => {
      if (!window.google) return;
      const input = inputRef.current;
      if (!input) return;

      const options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'us' },
      };

      const autocomplete = new window.google.maps.places.Autocomplete(input, options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;

        const city = place.address_components.find(c =>
          c.types.includes('locality') || c.types.includes('administrative_area_level_3')
        )?.long_name;

        onSelect(city || place.name);
      });
    });
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="search-input city-input"
      placeholder="Enter city"
      autoComplete="off"
    />
  );
}

export default CitySearch;
