import { Driver } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  DriverVehicleBundle,
  driverVehicleSchema,
} from "~/apps/solidarity-routing/types.wip";
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
              driver: {
                include: {
                  address: true,
                },
              },
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
              driver: {
                include: {
                  address: true,
                },
              },
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

  setRouteVehicles: protectedProcedure
    .input(
      z.object({ data: z.array(driverVehicleSchema), routeId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const route = await ctx.prisma.route.findUnique({
        where: {
          id: input.routeId,
        },
        include: {
          vehicles: {
            include: {
              endAddress: true,
              driver: {
                include: {
                  address: true,
                },
              },
              startAddress: true,
              breaks: true,
            },
          },
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
        input.data.map(async (driverVehicle) => {
          // const address = await ctx.prisma.address.create({

          //   data: {
          //     formatted: driverVehicle.vehicle.address.formatted,
          //     latitude: driverVehicle.driver.address.latitude,
          //     longitude: driverVehicle.driver.address.longitude,
          //     depotId: route!.depotId,
          //   },
          // });

          const defaultVehicle = await ctx.prisma.vehicle.findFirst({
            where: {
              id: driverVehicle.driver.defaultVehicleId,
            },
            include: {
              breaks: true,
              startAddress: true,
              endAddress: true,
            },
          });

          if (!defaultVehicle)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Default vehicle not found",
            });

          const startAddress = await ctx.prisma.address.create({
            data: {
              formatted: defaultVehicle.startAddress.formatted,
              latitude: defaultVehicle.startAddress.latitude,
              longitude: defaultVehicle.startAddress.longitude,
              depotId: route!.depotId,
            },
          });

          const endAddress = defaultVehicle?.endAddress?.formatted
            ? await ctx.prisma.address.create({
                data: {
                  formatted: defaultVehicle.endAddress.formatted,
                  latitude: defaultVehicle.endAddress.latitude,
                  longitude: defaultVehicle.endAddress.longitude,
                  depotId: route!.depotId,
                },
              })
            : {
                id: undefined,
              };

          const vehicle = await ctx.prisma.vehicle.create({
            data: {
              driverId: driverVehicle.driver.id,
              depotId: route!.depotId,

              startAddressId: startAddress.id,
              endAddressId: endAddress.id,
              shiftStart:
                defaultVehicle?.shiftStart ?? driverVehicle.vehicle.shiftStart,
              shiftEnd:
                defaultVehicle?.shiftEnd ?? driverVehicle.vehicle.shiftEnd,
              // type: driverVehicle.driver.type,
              capacity:
                defaultVehicle?.capacity ?? driverVehicle.vehicle.capacity,
              maxTasks:
                defaultVehicle?.maxTasks ?? driverVehicle.vehicle.maxTasks,
              maxTravelTime:
                defaultVehicle?.maxTravelTime ??
                driverVehicle.vehicle.maxTravelTime,
              maxDistance:
                defaultVehicle?.maxDistance ??
                driverVehicle.vehicle.maxDistance,
              notes: defaultVehicle?.notes ?? driverVehicle.vehicle.notes ?? "",
              cargo: defaultVehicle?.cargo ?? driverVehicle.vehicle.cargo ?? "",
              breaks: {
                create: (defaultVehicle
                  ? defaultVehicle.breaks
                  : driverVehicle?.vehicle?.breaks
                )?.map((b) => ({
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

  addRouteVehicle: protectedProcedure
    .input(
      z.object({
        routeId: z.string(),
        vehicle: driverVehicleSchema,
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

      const address = await ctx.prisma.address.create({
        data: {
          formatted: input.vehicle.driver.address.formatted,
          latitude: input.vehicle.driver.address.latitude,
          longitude: input.vehicle.driver.address.longitude,
          depotId: route!.depotId,
        },
      });

      const vehicle = await ctx.prisma.vehicle.create({
        data: {
          driverId: input.vehicle.driver.id,
          depotId: route!.depotId,
          startAddressId: address.id,
          shiftStart: input.vehicle.vehicle.shiftStart,
          shiftEnd: input.vehicle.vehicle.shiftEnd,

          capacity: input.vehicle.vehicle.capacity,
          maxTasks: input.vehicle.vehicle.maxTasks,
          maxTravelTime: input.vehicle.vehicle.maxTravelTime,
          maxDistance: input.vehicle.vehicle.maxDistance,
          breaks: {
            create: input.vehicle?.vehicle?.breaks?.map((b) => ({
              duration: b?.duration ?? 1800, //30 minutes in seconds
              start: b?.start ?? input.vehicle.vehicle.shiftStart,
              end: b?.end ?? input.vehicle.vehicle.shiftEnd,
            })),
          },
        },
      });

      return ctx.prisma.route.update({
        where: {
          id: input.routeId,
        },
        data: {
          vehicles: {
            connect: { id: vehicle.id },
          },
        },
      });
    }),

  getVehicleBundles: protectedProcedure
    .input(z.object({ routeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.vehicle.findMany({
        where: {
          routeId: input.routeId,
        },
        include: {
          driver: {
            include: {
              address: true,
            },
          },
          startAddress: true,
          endAddress: true,
          breaks: true,
        },
      });

      const bundles = data.map((vehicle) => ({
        driver: vehicle.driver,
        vehicle: vehicle,
      }));

      return bundles;
    }),
});
