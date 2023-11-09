import type { Map } from "leaflet";

const useRoutingMap = (mapRef: Map) => {
  return {
    mapRef,
  };
};
export default useRoutingMap;
