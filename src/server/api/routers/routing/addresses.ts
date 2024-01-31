import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const addressRouter = createTRPCRouter({
  getCurrentDepotAddresses: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .query(async ({ ctx, input }) => {
      const addresses = await ctx.prisma.address.findMany({
        where: {
          depotId: input.depotId,
        },
        include: {
          clients: true,
          drivers: true,
          startVehicles: true,
          endVehicles: true,
          jobs: true,
        },
      });

      return addresses;
    }),
  deleteAllDepotAddresses: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const addresses = await ctx.prisma.address.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return addresses;
    }),
});
