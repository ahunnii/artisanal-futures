import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const driversRouter = createTRPCRouter({
  getOwnedDrivers: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.driver.findMany({
        where: {
          depotId: input.depotId,
        },
      });
    }),
  createDriver: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
        name: z.string(),
        address: z.string(),
        coordinates: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        phone: z.string().optional(),
        email: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.driver.create({
        data: {
          depotId: input.depotId,
          name: input.name,
          address: input.address,
          latitude: input.coordinates.lat ?? 0,
          longitude: input.coordinates.lng ?? 0,
          phone: input.phone,
          email: input.email,
        },
      });
    }),
});
