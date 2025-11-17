import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import POILayer from "./POILayer";
import RouteLayer from "./RouteLayer";

export default function MapView() {
  const [filter, setFilter] = useState("cafe");

  return (
    <>
      <div style={{position:"absolute", zIndex:1000, padding:"10px"}}>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="cafe">Cafe</option>
          <option value="hospital">Hospital</option>
          <option value="shop">Shop</option>
        </select>
      </div>

      <MapContainer center={[10.762622, 106.660172]} zoom={14} style={{height:"100vh", width:"100vw"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <POILayer type={filter} />
        <RouteLayer />
      </MapContainer>
    </>
  );
}
