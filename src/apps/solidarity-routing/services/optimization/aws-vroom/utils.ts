import polyline from "@mapbox/polyline";
import { createHash } from "crypto";
import type {
  OptimizationData,
  Polyline,
  RouteData,
} from "~/apps/solidarity-routing/types";

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

const cuidToIndex = (cuid: string, arraySize: number): number => {
  // Calculate SHA-256 hash digest
  const hashDigest = createHash("sha256").update(cuid).digest("hex");
  // Convert digest to integer
  const hashInt = parseInt(hashDigest, 16);
  // Map the hash integer to the range of the array size
  const index = hashInt % arraySize;
  return index;
};
export const formatGeometryString = (
  geometryString: string,
  vehicleId: string
): Polyline => {
  const geometry = polyline.toGeoJSON(geometryString);

  const colorizedGeometry = {
    ...geometry,
    properties: { color: cuidToIndex(vehicleId, 19) },
  };

  return colorizedGeometry as Polyline;
};
