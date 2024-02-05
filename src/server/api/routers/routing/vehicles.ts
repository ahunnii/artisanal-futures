import { z } from "zod";
import {
  driverSchema,
  vehicleSchema,
} from "~/apps/solidarity-routing/types.wip";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const vehicleRouter = createTRPCRouter({
  getCurrentDepotVehicles: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .query(async ({ ctx, input }) => {
      const vehicles = await ctx.prisma.vehicle.findMany({
        where: {
          depotId: input.depotId,
        },
        include: {
          startAddress: true,
          driver: true,
        },
      });

      return vehicles;
    }),
  deleteAllDepotVehicles: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const vehicles = await ctx.prisma.vehicle.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return vehicles;
    }),
});
