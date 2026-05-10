import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CommentSection from "./CommentSection";
import { useLanguage } from "../context/LanguageContext";

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ setSelectedLocation }) {
    const { t } = useLanguage();
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setSelectedLocation([lng, lat]);
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>{t.you}</Popup>
        </Marker>
    );
}

function Map({ incidents, setSelectedLocation, deleteIncident, socket }) {
    const { t } = useLanguage();
    const center = [13.7563, 100.5018]; // Bangkok
    const currentUserId = localStorage.getItem("userId");

    const getMarkerIcon = (severity) => {
        let color = "green";
        if (severity === "medium") color = "orange";
        if (severity === "high") color = "red";

        return new L.DivIcon({
            className: "custom-div-icon",
            html: `<div style="background-color:${color}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    };

    return (
        <div className="w-full h-screen absolute top-0 left-0">
            <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {incidents.map((incident) => (
                    <Marker
                        key={incident._id}
                        position={[
                            incident.location.coordinates[1],
                            incident.location.coordinates[0],
                        ]}
                        icon={getMarkerIcon(incident.severity)}
                    >
                        <Popup minWidth={250}>
                            <div className="p-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-lg">{incident.title}</h2>
                                    {incident.user === currentUserId && (
                                        <span className="text-[10px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">
                                            {t.yours}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm my-1">{incident.description}</p>
                                <div className="flex justify-between items-center mt-2 border-t pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                            incident.severity === 'high' ? 'bg-red-100 text-red-700' :
                                            incident.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {t.severity[incident.severity] || incident.severity.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-zinc-400">
                                            {t.types[incident.type] || incident.type}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => deleteIncident(incident._id)}
                                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        {t.delete}
                                    </button>
                                </div>

                                <CommentSection incidentId={incident._id} socket={socket} />
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <LocationMarker setSelectedLocation={setSelectedLocation} />
            </MapContainer>
        </div>
    );
}

export default Map;
