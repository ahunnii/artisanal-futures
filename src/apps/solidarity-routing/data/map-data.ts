import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

export const MAP_DATA = {
  center: [42.33085782908872, -83.05011192993956] as LatLngExpression,
  zoom: 13,
  doubleClickZoom: false,
  maxBounds: [
    [40.70462625, -91.6624658],
    [49.29755475, -80.8782742],
  ] as LatLngBoundsExpression,
  minZoom: 6.5,
  style: {
    height: "100%",
    width: "100%",
    zIndex: -1,
  },
};
