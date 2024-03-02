import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  roadPointSchema,
  roadSchema,
  type RoadBundle,
} from "~/apps/solidarity-routing/types.wip";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const driverRouter2 = createTRPCRouter({
    addRoadToDepot: protectedProcedure
    .input(z.object({ depotId: z.string(), roadData: z.array(z.object({ lat: z.number(), lng: z.number() })) }))
    .mutation(async ({ ctx, input }) => {
      const updatedDepot = await ctx.prisma.depot.update({
        where: { id: input.depotId },
        data: {
          roads: {
            create: input.roadData.map(road => ({
              name: "Default Road",
              latitude: road.lat,
              longitude: road.lng,
            })),
          },
        },
      });
      return updatedDepot;
    }),

  setDepotRoads: protectedProcedure
    .input(z.object({ depotId: z.string(), roadId: z.string(), roadData: z.array(roadPointSchema) }))
    .mutation(async ({ ctx, input }) => {
      const updatedRoad = await ctx.prisma.road.update({
        where: { id: input.roadId, depotId: input.depotId },
        data: {
          points: {
            create: input.roadData.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude,
              order: point.order,
            })),
          },
        },
      });
      return updatedRoad;
    }),

  // This creates and adds to existing depots / routes
  createRoad: protectedProcedure
    .input(z.object({ depotId: z.string(), roadData: roadSchema }))
    .mutation(async ({ ctx, input }) => {
      const newRoad = await ctx.prisma.road.create({
        data: {
          name: input.roadData.name,
          depotId: input.depotId,
          points: {
            create: input.roadData.points.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude,
              order: point.order,
            })),
          },
        },
      });
      return newRoad;
    }),

  deleteRoad: protectedProcedure
    .input(z.object({ roadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedRoad = await ctx.prisma.road.delete({
        where: { id: input.roadId },
      });
      return deletedRoad;
    }),

  getRoads: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .query(async ({ ctx, input }) => {
      const roads = await ctx.prisma.road.findMany({
        where: { depotId: input.depotId },
        include: {
          points: true,
        },
      });
      return roads as RoadBundle[];
    }),

// NotImplemented
//
//   getRouteRoads: protectedProcedure
//     .input(z.object({ routeId: z.string() }))
//     .query(async ({ ctx, input }) => {
//       const routeRoads = await ctx.prisma.route.findUnique({
//         where: { id: input.routeId },
//         include: {
//           roads: {
//             include: {
//               points: true,
//             },
//           },
//         },
//       });
//       return routeRoads?.roads as RoadBundle[];
//     }),

});
