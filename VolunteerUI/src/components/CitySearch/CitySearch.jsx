import { useEffect, useRef, useState } from 'react';

function CitySearch({ value = '' , onSelect }) {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      const url = `https://us1.locationiq.com/v1/autocomplete?key=${import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN}&q=${encodeURIComponent(query)}&limit=3&format=json`;
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { accept: 'application/json' }
        });
        if (res.status === 429) {
          console.warn('Rate limited: Too many requests');
          return;
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching autocomplete:', err);
      }
    }, 400); // wait 400ms after typing
    return () => clearTimeout(timeoutId); // can if still typing
  }, [query]);
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSelect?.(val);
  };
  const handleSelect = (place) => {
  onSelect?.(place.address.name); 
  setResults([]);
};
  return (
    <div className="city-search" style={{ position: 'relative' }}>
      <input
        type="text"
        className="search-input city-input"
        placeholder="Enter city"
        autoComplete="off"
        value={value}
        onChange={handleInputChange}
      />
      {results.length > 0 && (
        <ul className="autocomplete-results">
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="autocomplete-item"
            >
              {place.address.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default CitySearch;
