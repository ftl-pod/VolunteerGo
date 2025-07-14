import "./LocationPage.css";
import {APIProvider, Map} from '@vis.gl/react-google-maps';

function LocationPage () {
    //add a search bar here to search for locations and let user know its showing their current location on default
    return (
        <>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={ () => console.log("Google Maps API loaded :)")}>
            <div className="map-container">
                <Map
                defaultCenter={{ lat: 37.7749, lng: -122.4194 }} // sf for now but will be user's location
                defaultZoom={10}
                onCameraChanged={(ev) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)}
                >
                </Map>
            </div>
        </APIProvider>   
        </>
    )
}

export default LocationPage;