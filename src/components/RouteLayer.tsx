import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

interface RouteLayerProps {
  start: [number, number];
  end: [number, number] | null;
}

export default function RouteLayer({ start, end }: RouteLayerProps) {
  const map = useMap();

  useEffect(()=>{
    if (!end) return;

    const control = (L as any).Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,

    }).addTo(map);

    return (): void => { map.removeControl(control); };

  }, [map, start, end]);

  return null;
}