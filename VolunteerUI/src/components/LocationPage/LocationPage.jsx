import "./LocationPage.css";
import React, {use, useEffect, useState} from 'react';
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';
import * as Geocode from 'react-geocode';
// need to import cluster stuff if i wanna do that


function LocationPage () {
    //add a search bar here to search for locations and let user know its showing their current location on default
    Geocode.setKey(import.meta.env.VITE_GOOGLE_GEOCODE_API_KEY);
    const [opps, setOpps] = useState([]);
    const [coords, setCoords] = useState([]); 
    useEffect(() => {
    const fetchOppsAndCoords = async () => {
        try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/opportunities`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setOpps(data);
        const coordsArr = await Promise.all(
            data.map(async (o) => {
                try {
                    const response = await Geocode.fromAddress(o.location);
                    const { lat, lng } = response.results[0].geometry.location;
                    return { id: o.id, position: { lat, lng } };
                } catch (error) {
                    console.error("Error fetching coordinates for", o.location, ":", error);
                    return { id: o.id, position: { lat: 37.7749, lng: -122.4194 } }; // default to SF if error
                }
            })
        );
        setCoords(coordsArr);
        } catch (err) {
        console.error("Failed to fetch opportunities:", err);
        }
    };
        fetchOppsAndCoords();
    }, []);
    return (
        <>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={ () => console.log("Google Maps API loaded :)")}>
            <div className="map-container">
                <Map
                mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
                defaultCenter={{ lat: 37.7749, lng: -122.4194 }} // sf for now but will be user's location
                defaultZoom={10}
                onCameraChanged={(ev) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)}
                >
                 {coords.map((c) => (
                        <AdvancedMarker
                            key={c.id}
                            position={c.position}
                        >
                        </AdvancedMarker>
                    ))}
                </Map>
            </div>
        </APIProvider>   
        </>
    )
}

export default LocationPage;