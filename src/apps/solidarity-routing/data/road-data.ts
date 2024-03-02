import { uniqueId } from "lodash";

import {
  roadPointSchema,
  roadSchema,
  type RoadBundle,
} from "~/apps/solidarity-routing/types.wip";

export const roadDataForNewLatLng = (
  lat: number,
  lng: number,
  depotId: string,
): RoadBundle => {
  return {
    id: uniqueId("road_"),
    name: "New Road",
    points: [{
      id: uniqueId("point_"),
      roadId: uniqueId("road_"),
      latitude: lat,
      longitude: lng,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
    depotId: depotId,
  };
};
