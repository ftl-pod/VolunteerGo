import "./LocationPage.css";
import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import * as Geocode from 'react-geocode';
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { MdLocationOn } from "react-icons/md";

function LocationPage () {
  Geocode.setKey(import.meta.env.VITE_GOOGLE_GEOCODE_API_KEY);
  const [opps, setOpps] = useState([]);
  const [coords, setCoords] = useState([]); 
  const [userLatLng, setUserLatLng] = useState({ lat: 37.7749, lng: -122.4194 }); // default SF coords
  const { user, token, isLoaded } = useAuth(); // get token for auth header
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!user || !token) return;

      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error('Failed to fetch user from backend');

        const userData = await userRes.json();

        if (userData.location) {
          const geocodeRes = await Geocode.fromAddress(userData.location);
          const loc = geocodeRes.results[0].geometry.location;
          setUserLatLng(loc);
        }
      } catch (err) {
        console.error("Error fetching user's location from backend:", err);
      }
    };

    const fetchOppsAndCoords = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/opportunities`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setOpps(data);

        const coordsArr = await Promise.all(
          data.map(async (o) => {
            try {
              const response = await Geocode.fromAddress(o.location);
              const { lat, lng } = response.results[0].geometry.location;
              return { id: o.id, position: { lat, lng }, title: o.name };
            } catch (error) {
              console.error("Error fetching coordinates for", o.location, ":", error);
              return { id: o.id, position: { lat: 37.7749, lng: -122.4194 }, title: "Can't find Title" };
            }
          })
        );

        setCoords(coordsArr);
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      }
    };

    if (isLoaded && user && token) {
      fetchUserLocation();
      fetchOppsAndCoords();
    }
  }, [isLoaded, user, token]);

  if (!isLoaded || !user) {
    return <div>Loading user data...</div>;
  }

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log("Google Maps API loaded :)")}>
        <div className="map-container">
          <Map
            key={`${userLatLng.lat}-${userLatLng.lng}`}
            mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
            defaultCenter={userLatLng}
            defaultZoom={10}
            onCameraChanged={(ev) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)}
          >
            {coords.map((c) => (
              <AdvancedMarker
                key={c.id}
                position={c.position}
                title={c.title}
                onClick={() => navigate(`/opportunity/${c.id}`)}
              >
                <MdLocationOn className="marker-icon" />
              </AdvancedMarker>
            ))}
          </Map>
        </div>
      </APIProvider>
    </>
  );
}

export default LocationPage;
