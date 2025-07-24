// src/utils/loadGoogleMaps.js
export function loadGoogleMaps(apiKey, onLoad) {
  // Avoid loading script multiple times
  if (document.getElementById('google-maps-script')) {
    if (onLoad) onLoad();
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = onLoad;
  document.head.appendChild(script);
}
