// src/components/MapView.tsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import POILayer from "./POILayer";
import RouteLayer from "./RouteLayer";
import axios from 'axios';

function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14);
  }, [center, map]);
  return null;
}

export default function MapView() {
  const [filter, setFilter] = useState("cafe");
  const [locationQuery, setLocationQuery] = useState("");
  const [searchCenter, setSearchCenter] = useState<[number, number]>([10.762622, 106.660172]);
  const [destinationPoint, setDestinationPoint] = useState<[number, number] | null>(null);

  const handleSearch = async () => {
    if (!locationQuery) return;
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`);
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSearchCenter([parseFloat(lat), parseFloat(lon)]);
        setDestinationPoint(null); 
      } else {
        alert("Không tìm thấy địa điểm.");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm địa điểm:", error);
      alert("Đã xảy ra lỗi khi tìm kiếm.");
    }
  };

  return (
    <>
      <div style={{position:"absolute", zIndex:1000, padding:"10px", backgroundColor: "white", borderRadius: "5px", top: 10, left: 10, display: "flex", gap: "10px"}}>
        
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="cafe">Cafe</option>
          <option value="hospital">Bệnh viện (Hospital)</option>
          <option value="shop">Cửa hàng (Shop)</option>
          <option value="restaurant">Nhà hàng (Restaurant)</option>
          <option value="pharmacy">Hiệu thuốc (Pharmacy)</option>
          <option value="bank">Ngân hàng (Bank)</option>
          <option value="atm">ATM</option>
          <option value="parking">Bãi đỗ xe (Parking)</option>
        </select>

        <input 
          type="text" 
          value={locationQuery} 
          onChange={e => setLocationQuery(e.target.value)}
          placeholder="Nhập địa điểm..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Tìm</button>
      </div>

      <MapContainer center={searchCenter} zoom={14} style={{height:"100vh", width:"100vw"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={searchCenter}>
          <Popup>
            {locationQuery ? `Vị trí: ${locationQuery}` : "Vị trí tìm kiếm"}
          </Popup>
        </Marker>

        <POILayer 
          type={filter} 
          center={searchCenter} 
          setDestination={setDestinationPoint}
        />
        <RouteLayer 
          start={searchCenter}
          end={destinationPoint}
        />
        
        <MapFlyTo center={searchCenter} />
      </MapContainer>
    </>
  );
}