// @ts-nocheck

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import L from "leaflet";

const attackIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width:14px;
      height:14px;
      background:#ef4444;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 6px rgba(239,68,68,0.7);
    "></div>
  `
});

export function AttackMap({ data }) {

  const center = [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {data.map((loc, index) => (
        <Marker
            key={index}
            position={[loc.latitude, loc.longitude]}
            icon={attackIcon}
            >
         <Popup>
            <div style={{ fontSize: "12px" }}>
                <b>Threat Source</b><br/>
                {loc.city ?? "Unknown"}, {loc.country}<br/>
                Lat: {loc.latitude.toFixed(2)}<br/>
                Lon: {loc.longitude.toFixed(2)}
            </div>
            </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}