"use client";

import { mappls, mappls_plugin } from "mappls-web-maps";
import { useEffect, useRef, useState } from "react";
const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const MarkerPlugin = ({ map, eLoc, setLatLng, markerRef }: any) => {
    useEffect(() => {
        if (!map || !eLoc) return;

        // Remove previous marker if it exists
        if (markerRef.current) {
            console.log("Removing existing marker:", markerRef.current);
            markerRef.current.remove();
        }

        mapplsPluginObject.pinMarker({
            map: map,
            pin: eLoc,
            popupHtml: '<h1 style="color:green">MapmyIndia</h1>',
        }, (markerInstance: any) => {
            console.log("New Marker:", markerInstance);
            markerRef.current = markerInstance;
            markerInstance.fitbounds({
                maxZoom: 15,
            });
            const { lat, lng } = markerInstance.obj.getPosition();
            setLatLng({ latitude: lat, longitude: lng })
        });
    }, [map, eLoc]);

return null;

};


const App = ({ eLoc, setLatLng }: any) => {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const loadObject = { map: true, plugins: ["geolocation"] };
    
    useEffect(() => {    
        mapplsClassObject.initialize(process.env.NEXT_PUBLIC_MMI_API_KEY, loadObject, () => {    
            const newMap = mapplsClassObject.Map({
                id: "map",
                properties: {
                center: [28.633, 77.2194],
                zoom: 4,
                geolocation: true,
                },
            });
        
            newMap.on("load", () => setIsMapLoaded(true));

            mapRef.current = newMap;

            // Add click event listener to the map
            newMap.on("click", (event: any) => {
                const { lat, lng } = event.lngLat; // Get clicked coordinates
                
                // Remove the existing marker if it exists
                if (markerRef.current) {
                    markerRef.current.remove();
                }    
        
                // Create a new marker at the clicked position
                markerRef.current = mapplsClassObject.Marker({
                    map: newMap,
                    position: { lat, lng },
                    fitbounds: false,
                });

                console.log("Marker placed at:", lat, lng);

                // Update the parent component with the selected coordinates    
                setLatLng({ latitude: lat, longitude: lng });

            });
        });
    
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }

            if (markerRef.current) {
                markerRef.current.remove();
            }
        };
    }, []);
    
    return (
        <div id="map" style={{ width: "100%", height: "500px", position: "relative" }}>
            {isMapLoaded && <MarkerPlugin map={mapRef.current} setLatLng={setLatLng} eLoc={eLoc} markerRef={markerRef} />}
        </div>
    );
};

export default App;