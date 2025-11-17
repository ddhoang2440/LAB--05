import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import * as L from 'leaflet';

export default function POILayer({ type }: { type:string }) {
  const [points, setPoints] = useState<any[]>([]);

  useEffect(()=>{
    const query = `[out:json][timeout:25];node["amenity"="${type}"](10.75,106.65,10.80,106.70);out 5;`;
    axios.post('https://overpass-api.de/api/interpreter', query)
      .then(res => setPoints(res.data.elements || []))
      .catch(console.error);
  }, [type]);

  return <>
    {points.map((p, i) => (
      <Marker key={i} position={[p.lat, p.lon]} icon={L.icon({iconUrl:"https://cdn-icons-png.flaticon.com/128/684/684908.png", iconSize:[32,32]})}>
        <Popup>{p.tags.name || type}</Popup>
      </Marker>
    ))}
  </>;
}
