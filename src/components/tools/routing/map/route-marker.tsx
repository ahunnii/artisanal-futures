import { divIcon } from "leaflet";
import { Truck } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, type FC } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup, type MarkerProps } from "react-leaflet";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { useSheet } from "~/hooks/routing/use-sheet";
import { useStops } from "~/hooks/routing/use-stops";
import { getColor } from "~/utils/routing";

interface IProps extends MarkerProps {
  variant: "stop" | "car" | "currentPosition";
  color: number;
  children: React.ReactNode;
  id: number;
  stopId?: number;
}

export const TruckIcon = (color: string) => {
  return divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: ReactDOMServer.renderToString(
      <span
        className={` relative -left-[0.5rem] -top-[0.5rem] block h-[2.5rem] w-[2.5rem] ${color} rounded-lg bg-white p-1 shadow-lg`}
      >
        <Truck className={`h-full w-full `} />
      </span>
    ),
  });
};

export const StopIcon = (color: string, id: number) => {
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

  return divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}"><span class="-rotate-45 text-white font-bold fixed  h-full w-full items-center flex justify-center ">${
      id ?? ""
    }</span></span>`,
  });
};

export const PositionIcon = () => {
  const markerHtmlStyles = `
    background-color: ${"#0043ff"};
    width: 1.25rem;
    height: 1.25rem;
    display: block;
   border-radius: 100%;
    position: relative;
  
  
    box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    border: 2px solid #FFFFFF`;

  return divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`,
  });
};

const RouteMarker: FC<IProps> = ({
  position,
  color,
  variant,
  id,
  stopId,
  children,
}) => {
  const { onOpen } = useSheet();
  const { setActiveLocationById } = useStops((state) => state);
  const { setActiveDriverById } = useDrivers((state) => state);

  const calculatedColor = useMemo(() => {
    if (color == -1)
      return {
        fill: "#0000003a",
        text: "#00000001",
      };

    return getColor(color);
  }, [color]);

  const onEdit = () => {
    if (variant === "stop") {
      setActiveLocationById(id);
      onOpen();
    } else {
      setActiveDriverById(id);
      onOpen();
    }
  };

  const icon =
    variant === "stop"
      ? StopIcon(calculatedColor.fill!, stopId!)
      : variant === "currentPosition"
      ? PositionIcon()
      : TruckIcon(calculatedColor.text!);
  const { route } = useParams();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {" "}
        <Marker position={position} icon={icon}>
          <Popup>{children}</Popup>
        </Marker>
      </ContextMenuTrigger>

      {!route && (
        <ContextMenuContent>
          <ContextMenuItem onClick={onEdit}>Edit... </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export default RouteMarker;
