import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { driverVehicleSchema } from "~/apps/solidarity-routing/types.wip";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const routePlanRouter = createTRPCRouter({
  getRoutePlansByDate: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        depotId: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      const startDate = new Date(input.date.toISOString());
      const endDate = new Date(startDate);

      // Set start time to midnight (00:00:00)
      startDate.setHours(0, 0, 0, 0);

      // Set end time to 11:59:59
      endDate.setHours(23, 59, 59, 999);

      return ctx.prisma.route.findMany({
        where: {
          deliveryAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          vehicles: {
            include: {
              driver: true,
              startAddress: true,
            },
          },
          jobs: {
            include: {
              address: true,
              client: true,
            },
          },
        },
      });
    }),

  getRoutePlanById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.route.findUnique({
        where: {
          id: input.id,
        },
        include: {
          vehicles: {
            include: {
              driver: true,
              startAddress: true,
            },
          },
          jobs: {
            include: {
              address: true,
              client: true,
            },
          },
        },
      });
    }),

  createRoutePlan: protectedProcedure
    .input(
      z.object({
        depotId: z.number(),
        date: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.route.create({
        data: {
          depotId: input.depotId,
          deliveryAt: input.date,
          // address: input.address,
          // latitude: input.coordinates.lat ?? 0,
          // longitude: input.coordinates.lng ?? 0,
        },
      });
    }),

  createRouteVehicles: protectedProcedure
    .input(
      z.object({
        routeId: z.string(),
        vehicles: z.array(driverVehicleSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const route = await ctx.prisma.route.findUnique({
        where: {
          id: input.routeId,
        },
        include: {
          vehicles: true,
        },
      });

      if (route?.vehicles.length) {
        await ctx.prisma.route.update({
          where: {
            id: input.routeId,
          },
          data: {
            vehicles: {
              deleteMany: {},
            },
          },
        });
      }

      const res = await Promise.all(
        input.vehicles.map(async (driverVehicle) => {
          const address = await ctx.prisma.address.create({
            data: {
              formatted: driverVehicle.driver.address.formatted,
              latitude: driverVehicle.driver.address.latitude,
              longitude: driverVehicle.driver.address.longitude,
              depotId: route!.depotId,
            },
          });

          const vehicle = await ctx.prisma.vehicle.create({
            data: {
              driverId: driverVehicle.driver.id,
              depotId: route!.depotId,
              startAddressId: address.id,
              shiftStart: driverVehicle.vehicle.shiftStart,
              shiftEnd: driverVehicle.vehicle.shiftEnd,
              type: driverVehicle.vehicle.type,
              capacity: driverVehicle.vehicle.capacity,
              maxTasks: driverVehicle.vehicle.maxTasks,
              maxTravelTime: driverVehicle.vehicle.maxTravelTime,
              maxDistance: driverVehicle.vehicle.maxDistance,
              breaks: {
                create: driverVehicle?.vehicle?.breaks?.map((b) => ({
                  duration: b?.duration ?? 1800, //30 minutes in seconds
                  start: b?.start ?? driverVehicle.vehicle.shiftStart,
                  end: b?.end ?? driverVehicle.vehicle.shiftEnd,
                })),
              },
            },
          });

          return vehicle;
        })
      )
        .then((data) => data)
        .catch((e) => {
          console.error(e);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something happened while creating drivers and vehicles",
          });
        });

      return ctx.prisma.route.update({
        where: {
          id: input.routeId,
        },
        data: {
          vehicles: {
            connect: res.map((v) => ({ id: v.id })),
          },
        },
      });
    }),
});
