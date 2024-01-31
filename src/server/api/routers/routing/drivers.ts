// import { Address } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import geocodingService from "~/apps/solidarity-routing/services/autocomplete";
import type { Address as GeocodedAddress } from "~/apps/solidarity-routing/services/optimization/types";
import { driverVehicleSchema } from "~/apps/solidarity-routing/types.wip";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const driversRouter = createTRPCRouter({
  createManyDriverAndVehicle: protectedProcedure
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
            },
          });

          const vehicle = await ctx.prisma.vehicle.create({
            data: {
              depotId: input.depotId,
              startAddressId: address.id,
              shiftStart: driverVehicle.vehicle.shiftStart,
              shiftEnd: driverVehicle.vehicle.shiftEnd,
              type: driverVehicle.vehicle.type,
              capacity: driverVehicle.vehicle.capacity,
              maxTasks: driverVehicle.vehicle.maxTasks,
              maxTravelTime: driverVehicle.vehicle.maxTravelTime,
              maxDistance: driverVehicle.vehicle.maxDistance,
              breaks: {
                create: driverVehicle.vehicle.breaks.map((b) => ({
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
  getCurrentDepotDrivers: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .query(async ({ ctx, input }) => {
      const drivers = await ctx.prisma.driver.findMany({
        where: {
          depotId: input.depotId,
        },
        include: {
          address: true,
          vehicles: true,
        },
      });

      return drivers;
    }),

  deleteAllDepotDrivers: protectedProcedure
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
