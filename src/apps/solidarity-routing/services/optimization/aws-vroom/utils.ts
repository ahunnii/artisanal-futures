import polyline from "@mapbox/polyline";

import type {
  OptimizationData,
  Polyline,
  RouteData,
} from "~/apps/solidarity-routing/types";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

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

export const formatGeometryString = (
  geometryString: string,
  vehicleId: string
): Polyline => {
  const geometry = polyline.toGeoJSON(geometryString);

  const colorizedGeometry = {
    ...geometry,
    properties: { color: cuidToIndex(vehicleId) },
  };

  return colorizedGeometry as Polyline;
};
