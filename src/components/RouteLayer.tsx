import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

export default function RouteLayer() {
  const map = useMap();

  useEffect(()=>{
    const control = (L as any).Routing.control({
      waypoints: [
        L.latLng(10.762622, 106.660172),
        L.latLng(10.776889, 106.700806)
      ],
      routeWhileDragging: true
    }).addTo(map);

    return (): void => { map.removeControl(control); };
  }, [map]);

  return null;
}
