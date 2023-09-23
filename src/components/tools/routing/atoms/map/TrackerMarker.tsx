import { divIcon } from "leaflet";
import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import { getColor } from "~/utils/routing";

interface MarkerProps {
  position: [number, number];
  name: string;
  id: number;
  colorMapping: number;
}

/**
 * Custom marker for stops, updates color when the optimization gets created or updated
 */
const TrackerMarker = ({ position, name, id, colorMapping }: MarkerProps) => {
  const color = useMemo(() => {
    return getColor(colorMapping).fill;
  }, [colorMapping]);

  const markerHtmlStyles = `
        background-color: ${color ?? "#6366f1"};
        width: 2rem;
        height: 2rem;
        display: block;
        left: -0.5rem;
        top: -0.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg); 
		box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        border: 3px solid #FFFFFF`;

  const icon = divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`,
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        {name} {id}
      </Popup>
    </Marker>
  );
};
export default TrackerMarker;
