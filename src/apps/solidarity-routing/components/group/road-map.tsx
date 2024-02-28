import React, { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet'; // Importing type for TypeScript annotations
import 'leaflet/dist/leaflet.css'; // Import CSS

const GroupingMap = () => {
  const mapRef = useRef<HTMLDivElement>(null); // Ref for the div element where the map will be rendered
  const mapInstanceRef = useRef<LeafletMap | null>(null); // Ref to store the Leaflet map instance

  useEffect(() => {
    // Dynamically import Leaflet inside useEffect to ensure it's only executed client-side
    import('leaflet').then(L => {
      if (mapRef.current && !mapInstanceRef.current) { // Check if the div is available and no map instance exists
        const DETROIT_CENTER: [number, number] = [
          42.33370343157542,
          -83.04849673684542
        ];
        const map: LeafletMap = L.map(mapRef.current).setView(
          DETROIT_CENTER,
        13);
        mapInstanceRef.current = map; // Store the map instance in the ref

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Additional Leaflet map setup here
      }
    });
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return <div ref={mapRef} style={{ height: '100vh', width: '100vw' }} />;
};

export default GroupingMap;