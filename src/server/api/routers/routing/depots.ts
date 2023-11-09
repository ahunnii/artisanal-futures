import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const depotsRouter = createTRPCRouter({
  getOwnedDepot: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.depot.findFirst({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
  createDepot: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        coordinates: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.depot.create({
        data: {
          ownerId: ctx.session.user.id,
          name: input.name,
          address: input.address,
          latitude: input.coordinates.lat ?? 0,
          longitude: input.coordinates.lng ?? 0,
        },
      });
    }),
});
