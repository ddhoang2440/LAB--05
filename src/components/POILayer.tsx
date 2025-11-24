import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import * as L from 'leaflet';

interface POILayerProps {
  type: string;
  center: [number, number];
  setDestination: (coords: [number, number]) => void; // Thêm prop này
}


export default function POILayer({ type, center, setDestination }: POILayerProps) { // Thêm prop
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    const radius = 2000; 
    const query = `[out:json][timeout:25];
                   (
                     node(around:${radius}, ${center[0]}, ${center[1]})["amenity"="${type}"];
                     way(around:${radius}, ${center[0]}, ${center[1]})["amenity"="${type}"];
                     relation(around:${radius}, ${center[0]}, ${center[1]})["amenity"="${type}"];
                   );
                   out center 5;`;

    axios.post('https://overpass-api.de/api/interpreter', query)
      .then(res => {
        const validPoints = res.data.elements?.map((p: any) => ({
          lat: p.lat || p.center.lat,
          lon: p.lon || p.center.lon,
          tags: p.tags
        })) || [];
        
        setPoints(validPoints);
      })
      .catch(console.error);
  }, [type, center]);

  return <>
    {points.map((p, i) => (
      <Marker 
        key={i} 
        position={[p.lat, p.lon]} 
        icon={L.icon({iconUrl:"https://cdn-icons-png.flaticon.com/128/684/684908.png", iconSize:[32,32]})}
        
        // === THÊM MỚI ===
        eventHandlers={{
          click: () => {
            setDestination([p.lat, p.lon]); // Báo cho MapView biết điểm đến mới
          },
        }}
        // ==============
      >
        <Popup>{p.tags.name || type}</Popup>
      </Marker>
    ))}
  </>;
}