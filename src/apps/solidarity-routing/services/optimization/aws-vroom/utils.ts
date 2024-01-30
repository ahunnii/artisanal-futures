import type {
  OptimizationData,
  Polyline,
  RouteData,
} from "~/apps/solidarity-routing/types";

import polyline from "@mapbox/polyline";

const calculateGeometry = (data: OptimizationData): Polyline[] => {
  return data.routes.map((route: RouteData) => {
    return polyline.toGeoJSON(route?.geometry);
  }) as Polyline[];
};

const colorizeGeometry = ({
  geometry,
  routes,
}: {
  geometry: Polyline[];
  routes: RouteData[];
}) => {
  return geometry.map((route: Polyline, idx: number) => {
    return {
      ...route,
      properties: { color: routes[idx]!.vehicle },
    };
  });
};

export const formatGeometry = (data: OptimizationData): Polyline[] => {
  const geometry = calculateGeometry(data);

  const colorizedGeometry = colorizeGeometry({
    geometry,
    routes: data.routes,
  });

  return colorizedGeometry;
};
