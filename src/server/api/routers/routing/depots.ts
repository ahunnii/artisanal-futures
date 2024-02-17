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

  getDepot: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const depot = await ctx.prisma.depot.findFirst({
        where: {
          id: input.id,
        },
        include: {
          address: true,
        },
      });

      return depot;
    }),

  createDepot: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),

        address: z
          .object({
            formatted: z.string(),
            latitude: z.number(),
            longitude: z.number(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let address;

      const depot = await ctx.prisma.depot.create({
        data: {
          ownerId: ctx.session.user.id,
          name: input.name,
        },
      });

      if (input.address) {
        address = await ctx.prisma.address.create({
          data: {
            formatted: input.address.formatted,
            latitude: input.address.latitude,
            longitude: input.address.longitude,
          },
        });
      }

      return ctx.prisma.depot.update({
        where: {
          id: depot.id,
        },
        data: {
          addressId: address?.id ?? undefined,
        },
      });
    }),

  updateDepot: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
        name: z.string().optional(),

        address: z
          .object({
            formatted: z.string(),
            latitude: z.number(),
            longitude: z.number(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let address;

      const depot = await ctx.prisma.depot.findUnique({
        where: {
          id: input.depotId,
        },
      });

      console.log(depot);
      if (input.address) {
        address =
          (await ctx.prisma.address.upsert({
            where: {
              id: depot?.addressId ?? "",
            },
            update: {
              formatted: input.address.formatted,
              latitude: input.address.latitude,
              longitude: input.address.longitude,
            },
            create: {
              formatted: input.address.formatted,
              latitude: input.address.latitude,
              longitude: input.address.longitude,
            },
          })) ?? null;
      }

      return ctx.prisma.depot.update({
        where: {
          id: input.depotId,
        },
        data: {
          addressId: address?.id ?? null,
          name: input.name,
        },
      });
    }),
});
