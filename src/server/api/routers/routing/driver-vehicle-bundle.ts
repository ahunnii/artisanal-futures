import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  driverVehicleSchema,
  type DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const driverVehicleBundleRouter = createTRPCRouter({
  createMany: protectedProcedure
    .input(
      z.object({ data: z.array(driverVehicleSchema), depotId: z.number() })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await Promise.all(
        input.data.map(async (driverVehicle) => {
          const address = await ctx.prisma.address.create({
            data: {
              formatted: driverVehicle.driver.address.formatted,
              latitude: driverVehicle.driver.address.latitude,
              longitude: driverVehicle.driver.address.longitude,
              depotId: input.depotId,
            },
          });

          const driver = await ctx.prisma.driver.create({
            data: {
              depotId: input.depotId,
              name: driverVehicle.driver.name,
              email: driverVehicle.driver.email,
              phone: driverVehicle.driver.phone,
              addressId: address.id,
            },
          });

          const vehicle = await ctx.prisma.vehicle.create({
            data: {
              depotId: input.depotId,
              startAddressId: address.id,
              shiftStart: driverVehicle.vehicle.shiftStart,
              shiftEnd: driverVehicle.vehicle.shiftEnd,

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

          await ctx.prisma.driver.update({
            where: {
              id: driver.id,
            },
            data: {
              address: {
                connect: {
                  id: address.id,
                },
              },
              vehicles: {
                connect: {
                  id: vehicle.id,
                },
              },
              defaultVehicleId: vehicle.id,
            },
          });

          return { driver, vehicle };
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

      return res;
    }),
  createOne: protectedProcedure
    .input(
      z.object({
        data: driverVehicleSchema,
        depotId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //Assumptions made hers:
      // 1. The driver and vehicle are created in the same depot
      // 2. The driver's default vehicle is the vehicle being created

      try {
        const address = await ctx.prisma.address.create({
          data: {
            formatted: input.data.driver.address.formatted,
            latitude: input.data.driver.address.latitude,
            longitude: input.data.driver.address.longitude,
            depotId: input.depotId,
          },
        });

        const driver = await ctx.prisma.driver.create({
          data: {
            depotId: input.depotId,
            name: input.data.driver.name,
            email: input.data.driver.email,
            phone: input.data.driver.phone,
          },
        });

        const vehicle = await ctx.prisma.vehicle.create({
          data: {
            depotId: input.depotId,
            startAddressId: address.id,
            shiftStart: input.data.vehicle.shiftStart,
            shiftEnd: input.data.vehicle.shiftEnd,

            capacity: input.data.vehicle.capacity,
            maxTasks: input.data.vehicle.maxTasks,
            maxTravelTime: input.data.vehicle.maxTravelTime,
            maxDistance: input.data.vehicle.maxDistance,
            breaks: {
              create: input.data?.vehicle?.breaks?.map((b) => ({
                duration: b?.duration ?? 1800, //30 minutes in seconds
                start: b?.start ?? input.data.vehicle.shiftStart,
                end: b?.end ?? input.data.vehicle.shiftEnd,
              })),
            },
          },
        });

        await ctx.prisma.driver.update({
          where: {
            id: driver.id,
          },
          data: {
            address: {
              connect: {
                id: address.id,
              },
            },
            vehicles: {
              connect: {
                id: vehicle.id,
              },
            },
            defaultVehicleId: vehicle.id,
          },
        });

        return { driver, vehicle };
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something happened while creating drivers and vehicles",
        });
      }
    }),

  updateOne: protectedProcedure
    .input(
      z.object({
        data: driverVehicleSchema,
        depotId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //Assumptions made hers:
      // 1. The driver and vehicle are created in the same depot
      // 2. The driver's default vehicle is the vehicle being created

      try {
        const address = await ctx.prisma.address.create({
          data: {
            formatted: input.data.driver.address.formatted,
            latitude: input.data.driver.address.latitude,
            longitude: input.data.driver.address.longitude,
            depotId: input.depotId,
          },
        });

        const driver = await ctx.prisma.driver.create({
          data: {
            depotId: input.depotId,
            name: input.data.driver.name,
            email: input.data.driver.email,
            phone: input.data.driver.phone,
          },
        });

        const vehicle = await ctx.prisma.vehicle.create({
          data: {
            depotId: input.depotId,
            startAddressId: address.id,
            shiftStart: input.data.vehicle.shiftStart,
            shiftEnd: input.data.vehicle.shiftEnd,

            capacity: input.data.vehicle.capacity,
            maxTasks: input.data.vehicle.maxTasks,
            maxTravelTime: input.data.vehicle.maxTravelTime,
            maxDistance: input.data.vehicle.maxDistance,
            breaks: {
              create: input.data?.vehicle?.breaks?.map((b) => ({
                duration: b?.duration ?? 1800, //30 minutes in seconds
                start: b?.start ?? input.data.vehicle.shiftStart,
                end: b?.end ?? input.data.vehicle.shiftEnd,
              })),
            },
          },
        });

        await ctx.prisma.driver.update({
          where: {
            id: driver.id,
          },
          data: {
            address: {
              connect: {
                id: address.id,
              },
            },
            vehicles: {
              connect: {
                id: vehicle.id,
              },
            },
            defaultVehicleId: vehicle.id,
          },
        });

        return { driver, vehicle };
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something happened while creating drivers and vehicles",
        });
      }
    }),

  getByDepotId: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .query(async ({ ctx, input }) => {
      const drivers = await ctx.prisma.driver.findMany({
        where: {
          depotId: input.depotId,
        },
        include: {
          address: true,
          vehicles: {
            include: {
              startAddress: true,
              breaks: true,
            },
          },
        },
      });

      const bundles = drivers.map((driver) => {
        const defaultVehicle = driver.vehicles.find(
          (vehicle) => vehicle.id === driver.defaultVehicleId
        );
        return {
          driver,
          vehicle: defaultVehicle,
        };
      });

      return bundles as DriverVehicleBundle[];
    }),

  deleteAllByDepotId: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const drivers = await ctx.prisma.driver.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return drivers;
    }),
});
