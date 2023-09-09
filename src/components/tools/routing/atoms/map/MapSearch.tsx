/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { divIcon } from "leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";

interface IProps {
  provider: unknown;
}
/**
 * Search component for the map allowing address lookup
 */

const icon = divIcon({
  className: "my-custom-pin",
  iconAnchor: [0, 24],
  popupAnchor: [0, -36],
  html: `<span style="
    ${`background-color: ${"#6366f1"};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -0.5rem;
    top: -0.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg); 
    box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border: 3px solid #FFFFFF`}" />`,
});

const MapSearch = ({ provider }: IProps) => {
  const map = useMap();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      marker: {
        icon: icon,
        draggable: false,
      },
    });

    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [provider, map]);

  return null;
};

export default MapSearch;
