import "./LocationPage.css";
import React, {use, useEffect, useState} from 'react';
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';
import * as Geocode from 'react-geocode';
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { MdLocationOn } from "react-icons/md";

// need to import cluster stuff if i wanna do that


function LocationPage () {
    //add a search bar here to search for locations and let user know its showing their current location on default
    Geocode.setKey(import.meta.env.VITE_GOOGLE_GEOCODE_API_KEY);
    const [opps, setOpps] = useState([]);
    const [coords, setCoords] = useState([]); 
    const [userLatLng, setUserLatLng] = useState({ lat: 37.7749, lng: -122.4194 })
    // pulling from publicMetadata -> get user info
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
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
                    return { id: o.id, position: { lat, lng }, title: o.name };
                } catch (error) {
                    console.error("Error fetching coordinates for", o.location, ":", error);
                    // line below is just testing
                    return { id: o.id, position: { lat: 37.7749, lng: -122.4194 }, title : "Can't find Title" }; // default to SF if error
                }
            })
        );
        console.log(coordsArr)
        setCoords(coordsArr);
        
        } catch (err) {
        console.error("Failed to fetch opportunities:", err);
        }
    };
        fetchOppsAndCoords();
        if (isLoaded && user?.publicMetadata?.location) {
            console.log("hi")
            const getUserCoords = async () => {
            try {
                const userResp = await Geocode.fromAddress(user.publicMetadata.location);
                const userLoc = userResp.results[0].geometry.location;
                setUserLatLng(userLoc);
            } catch (error) {
                console.error("Error fetching user's location:", error);
            }
      };
        getUserCoords();
    }
    }, [isLoaded, user]);
        if (!isLoaded && user?.publicMetadata) {
        return <div>Loading user data...</div>;
    }
    return (
        <>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={ () => console.log("Google Maps API loaded :)")}>
            <div className="map-container">
                <Map
                key={`${userLatLng.lat}-${userLatLng.lng}`} //lets you move around map
                mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
                defaultCenter={userLatLng} // sf when not logged in
                defaultZoom={10}
                onCameraChanged={(ev) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)}
                >
                 {coords.map((c) => (
                        <AdvancedMarker
                            key={c.id}
                            position={c.position}
                            title={c.title}
                            onClick={() => navigate(`/opportunity/${c.id}`)}>
                            <MdLocationOn   className="marker-icon"/>
                        </AdvancedMarker>
                    ))}
                </Map>
            </div>
        </APIProvider>   
        </>
    )
}

export default LocationPage;