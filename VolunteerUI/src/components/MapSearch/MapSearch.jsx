import React, { useEffect, useRef } from "react";

function MapSearch({ onPlaceSelect }) {
  const inputRef = useRef(null);

    useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.warn("Google Maps Places API not yet available");
        return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
    });

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
        const { lat, lng } = place.geometry.location;
        onPlaceSelect({ lat: lat(), lng: lng() });
        }
    });
    }, []);

  return (
    <div className="map-search-container">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a city..."
        className="map-search-input"
      />
    </div>
  );
}

export default MapSearch;
