import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { FC, useEffect } from "react";
import * as ReactLeaflet from "react-leaflet";

const { MapContainer } = ReactLeaflet;

const Map = ({ forwardedRef, children, className, width, height, ...rest }) => {
  let mapClassName = "";

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  useEffect(() => {
    (async function init() {
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer
      ref={forwardedRef}
      className={mapClassName}
      zoom={15}
      {...rest}
      doubleClickZoom={false}
      maxBounds={[
        [40.70462625, -91.6624658],
        [49.29755475, -80.8782742],
      ]}
      minZoom={6.5}
    >
      {children(ReactLeaflet, Leaflet)}
    </MapContainer>
  );
};

export default Map;
