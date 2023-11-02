import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const driverRouter = createTRPCRouter({
  //   getAllShops: protectedProcedure.query(({ ctx }) => {
  //     return ctx.prisma.routeDepot.findMany({
  //       where: {
  //         users: {

  //         }
  //       },
  //     });
  //   }),

  //   getShop: protectedProcedure
  //     .input(z.object({ shopId: z.string() }))
  //     .query(({ ctx, input }) => {
  //       return ctx.prisma.shop.findUnique({
  //         where: {
  //           id: input.shopId,
  //           ownerId: ctx.session.user.id,
  //         },
  //       });
  //     }),
  getCurrentDepotDrivers: protectedProcedure.query(async ({ ctx }) => {
    const depot = await ctx.prisma.routeDepot.findFirst({
      where: {
        ownerId: ctx.session.user.id,
      },
    });

    if (!depot)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Not allowed",
      });

    const drivers = await ctx.prisma.driver.findMany({
      where: {
        routeDepotId: depot.id,
      },
    });
    return drivers;
  }),

  getDriver: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const depot = await ctx.prisma.routeDepot.findFirst({
        where: {
          ownerId: ctx.session.user.id,
        },
      });

      if (!depot)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not allowed",
        });

      return ctx.prisma.driver.findUnique({
        where: {
          id: input.id,
          routeDepotId: depot.id,
        },
      });
    }),

  createDriver: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string().optional(),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      if (!input.phone)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "address is required",
        });
      if (!input.email)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "coordinates are required",
        });

      const depot = await ctx.prisma.routeDepot.findFirst({
        where: {
          ownerId: ctx.session.user.id,
        },
      });

      if (!depot)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not allowed",
        });

      const driver = await ctx.prisma.driver.create({
        data: {
          name: input.name,
          routeDepotId: depot.id,
          email: input.email,
          phone: input.phone ?? "",
        },
      });

      const startingData = await ctx.prisma.driver.findFirst({
        where: {
          routeDepotId: depot.id,
          id: driver.id,
        },
        data: {
          routeDepot: {
            create: {
              data: [
                {
                  name: "Starting Location",
                  address: depot.address,
                  lat: depot.lat,
                  lng: depot.lng,
                  type: "depot",
                  routeDepotId: depot.id,
                },
              ],
            },
          },
        },
      });
    }),

  deleteDriver: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Driver id is required",
        });

      const depot = await ctx.prisma.routeDepot.findFirst({
        where: {
          ownerId: ctx.session.user.id,
        },
      });

      if (!depot)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not allowed",
        });

      return ctx.prisma.driver.delete({
        where: {
          id: input.id,
          routeDepotId: depot.id,
        },
      });
    }),
});
