import { z } from "zod";
import type { DepotValues } from "~/apps/solidarity-routing/types.wip";
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
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const depot = await ctx.prisma.depot.findFirst({
        where: {
          id: input.id,
        },
      });

      const address = depot?.depotAddressId
        ? await ctx.prisma.address.findFirst({
            where: {
              id: depot.depotAddressId,
            },
          })
        : undefined;

      return {
        ...depot,
        address: address ?? undefined,
      } as DepotValues;
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
            depotId: depot.id,
          },
        });
      }

      return ctx.prisma.depot.update({
        where: {
          id: depot.id,
        },
        data: {
          depotAddressId: address?.id ?? undefined,
        },
      });
    }),

  updateDepot: protectedProcedure
    .input(
      z.object({
        depotId: z.number(),
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
              id: depot?.depotAddressId ?? "",
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
              depotId: input.depotId,
            },
          })) ?? null;
      }

      console.log(address);

      return ctx.prisma.depot.update({
        where: {
          id: input.depotId,
        },
        data: {
          depotAddressId: address?.id ?? null,
          name: input.name,
        },
      });
    }),
});
