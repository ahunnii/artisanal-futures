// import { Address } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { get } from "jquery";
import { z } from "zod";

import {
  driverSchema,
  driverVehicleSchema,
  vehicleSchema,
  type DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const driversRouter = createTRPCRouter({
  setDepotVehicles: protectedProcedure
    .input(
      z.object({ data: z.array(driverVehicleSchema), depotId: z.number() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Drivers overridden should still have their vehicles kept for record keeping
      await ctx.prisma.depot.update({
        where: {
          id: input.depotId,
        },

        data: {
          drivers: {
            deleteMany: {},
          },
          vehicles: {
            deleteMany: {},
          },
        },
      });

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
              cargo: driverVehicle.vehicle.cargo ?? "",
              notes: driverVehicle.vehicle.notes ?? "",

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

  // This creates and adds to existing depots / routes
  createVehicleBundles: protectedProcedure
    .input(
      z.object({
        data: z.array(driverVehicleSchema),
        depotId: z.number(),
        routeId: z.string().optional(),
        override: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await Promise.all(
        input.data.map(async (driverVehicle) => {
          // TODO: Addresses that are not being used by anything should be deleted
          const address = await ctx.prisma.address.create({
            data: {
              formatted: driverVehicle.driver.address.formatted,
              latitude: driverVehicle.driver.address.latitude,
              longitude: driverVehicle.driver.address.longitude,
              depotId: input.depotId,
            },
          });

          const startAddress = await ctx.prisma.address.create({
            data: {
              formatted: driverVehicle.vehicle.startAddress.formatted,
              latitude: driverVehicle.vehicle.startAddress.latitude,
              longitude: driverVehicle.vehicle.startAddress.longitude,
              depotId: input.depotId,
            },
          });

          const endAddress = await ctx.prisma.address.create({
            data: {
              formatted: driverVehicle?.vehicle?.endAddress?.formatted,
              latitude: driverVehicle.vehicle.endAddress.latitude,
              longitude: driverVehicle.vehicle.endAddress.longitude,
              depotId: input.depotId,
            },
          });

          //Create driver for depot
          const driver = await ctx.prisma.driver.create({
            data: {
              depotId: input.depotId,
              name: driverVehicle.driver.name,
              email: driverVehicle.driver.email,
              phone: driverVehicle.driver.phone,
              addressId: address.id,
            },
          });

          //Create default vehicle for driver
          const vehicle = await ctx.prisma.vehicle.create({
            data: {
              depotId: input.depotId,

              startAddressId: startAddress.id,
              endAddressId: endAddress.id,
              shiftStart: driverVehicle.vehicle.shiftStart,
              shiftEnd: driverVehicle.vehicle.shiftEnd,
              cargo: driverVehicle.vehicle.cargo ?? "",
              notes: driverVehicle.vehicle.notes ?? "",

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

          //Connect default vehicle to driver
          await ctx.prisma.driver.update({
            where: {
              id: driver.id,
            },
            data: {
              vehicles: {
                connect: {
                  id: vehicle.id,
                },
              },
              defaultVehicleId: vehicle.id,
            },
          });

          //If routeId is provided, connect new vehicle to route
          if (input.routeId) {
            const routeStartAddress = await ctx.prisma.address.create({
              data: {
                formatted: startAddress.formatted,
                latitude: startAddress.latitude,
                longitude: startAddress.longitude,
                depotId: input.depotId,
              },
            });
            const routeEndAddress = await ctx.prisma.address.create({
              data: {
                formatted: endAddress.formatted,
                latitude: endAddress.latitude,
                longitude: endAddress.longitude,
                depotId: input.depotId,
              },
            });

            const routeVehicle = await ctx.prisma.vehicle.create({
              data: {
                depotId: input.depotId,
                driverId: driver.id,
                startAddressId: routeStartAddress.id,
                endAddressId: routeEndAddress.id,
                shiftStart: driverVehicle.vehicle.shiftStart,
                shiftEnd: driverVehicle.vehicle.shiftEnd,
                cargo: driverVehicle.vehicle.cargo ?? "",
                notes: driverVehicle.vehicle.notes ?? "",

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

            await ctx.prisma.route.update({
              where: {
                id: input.routeId,
              },
              data: {
                vehicles: {
                  connect: {
                    id: routeVehicle.id,
                  },
                },
              },
            });
          }

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

  deleteVehicle: protectedProcedure
    .input(
      z.object({
        vehicleId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.vehicle.delete({
        where: {
          id: input.vehicleId,
        },
      });
    }),

  deleteVehicleBundle: protectedProcedure
    .input(
      z.object({
        driverId: z.string(),
        vehicleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.prisma.driver.findUnique({
        where: {
          id: input.driverId,
        },
        include: {
          vehicles: true,
        },
      });

      if (driver?.vehicles) {
        await ctx.prisma.vehicle.deleteMany({
          where: {
            id: {
              in: driver.vehicles.map((v) => v.id),
            },
          },
        });

        await ctx.prisma.address.deleteMany({
          where: {
            id: {
              in: driver.vehicles.map((v) => v.startAddressId),
            },
          },
        });
      }

      return ctx.prisma.driver.delete({
        where: {
          id: input.driverId,
        },
      });

      // await ctx.prisma.vehicle.delete({
      //   where: {
      //     id: input.vehicleId,
      //   },
      // });

      // return ctx.prisma.driver.delete({
      //   where: {
      //     id: input.driverId,
      //   },
      // });
    }),

  updateDriverDefaults: protectedProcedure
    .input(
      z.object({
        defaultId: z.string(),
        depotId: z.number(),
        bundle: driverVehicleSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const defaultVehicle = await ctx.prisma.vehicle.findUnique({
        where: {
          id: input.defaultId,
        },
      });

      if (!defaultVehicle) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Default vehicle not found",
        });
      }

      await ctx.prisma.vehicle.update({
        where: {
          id: input.defaultId,
        },
        data: {
          breaks: {
            deleteMany: {},
          },
        },
      });

      // Set default start address

      const startAddress = await ctx.prisma.address.upsert({
        where: {
          id: defaultVehicle.startAddressId ?? undefined,
        },
        update: {
          formatted: input.bundle.vehicle.startAddress.formatted,
          latitude: input.bundle.vehicle.startAddress.latitude,
          longitude: input.bundle.vehicle.startAddress.longitude,
        },
        create: {
          formatted: input.bundle.vehicle.startAddress.formatted,
          latitude: input.bundle.vehicle.startAddress.latitude,
          longitude: input.bundle.vehicle.startAddress.longitude,
          depotId: input.depotId,
        },
      });

      const endAddress =
        input.bundle.vehicle.endAddress.formatted !== ""
          ? await ctx.prisma.address.upsert({
              where: {
                id: defaultVehicle?.endAddressId ?? undefined,
              },
              update: {
                formatted: input.bundle.vehicle.endAddress.formatted,
                latitude: input.bundle.vehicle?.endAddress.latitude,
                longitude: input.bundle.vehicle?.endAddress.longitude,
              },
              create: {
                formatted: input.bundle.vehicle.endAddress.formatted,
                latitude: input.bundle.vehicle?.endAddress.latitude,
                longitude: input.bundle.vehicle?.endAddress.longitude,
                depotId: startAddress.depotId,
              },
            })
          : {
              id: undefined,
            };

      return ctx.prisma.vehicle.update({
        where: {
          id: defaultVehicle.id,
        },
        data: {
          startAddressId: startAddress.id,
          endAddressId: endAddress.id,
          shiftStart: input.bundle.vehicle.shiftStart,
          shiftEnd: input.bundle.vehicle.shiftEnd,
          cargo: input.bundle.vehicle.cargo ?? "",
          notes: input.bundle.vehicle.notes ?? "",
          capacity: input.bundle.vehicle.capacity,
          maxTasks: input.bundle.vehicle.maxTasks,
          maxTravelTime: input.bundle.vehicle.maxTravelTime,
          maxDistance: input.bundle.vehicle.maxDistance,
          breaks: {
            create: input.bundle?.vehicle?.breaks?.map((b) => ({
              duration: b?.duration ?? 1800, //30 minutes in seconds
              start: b?.start ?? input.bundle.vehicle.shiftStart,
              end: b?.end ?? input.bundle.vehicle.shiftEnd,
            })),
          },
        },
      });
    }),

  updateDriverDetails: protectedProcedure
    .input(z.object({ driverId: z.string(), driver: driverSchema }))
    .mutation(async ({ ctx, input }) => {
      if (input.driver.addressId) {
        await ctx.prisma.address.update({
          where: {
            id: input.driver?.addressId,
          },
          data: {
            formatted: input.driver?.address.formatted,
            latitude: input.driver?.address.latitude,
            longitude: input.driver?.address.longitude,
          },
        });
      }

      return ctx.prisma.driver.update({
        where: {
          id: input.driverId,
        },
        data: {
          name: input?.driver?.name,
          email: input?.driver?.email,
          phone: input?.driver?.phone,
        },
      });
    }),

  updateVehicleDetails: protectedProcedure
    .input(z.object({ vehicle: vehicleSchema, routeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const startAddress = await ctx.prisma.address.update({
        where: {
          id: input.vehicle.startAddressId,
        },
        data: {
          formatted: input.vehicle.startAddress.formatted,
          latitude: input.vehicle.startAddress.latitude,
          longitude: input.vehicle.startAddress.longitude,
        },
      });

      const endAddress = await ctx.prisma.address.upsert({
        where: {
          id: input.vehicle.endAddressId,
        },
        update: {
          formatted: input.vehicle.endAddress.formatted,
          latitude: input.vehicle.endAddress.latitude,
          longitude: input.vehicle.endAddress.longitude,
        },
        create: {
          formatted: input.vehicle.endAddress.formatted,
          latitude: input.vehicle.endAddress.latitude,
          longitude: input.vehicle.endAddress.longitude,
          depotId: startAddress.depotId,
        },
      });

      await ctx.prisma.vehicle.update({
        where: {
          id: input.vehicle.id,
          routeId: input.routeId,
        },
        data: {
          breaks: {
            deleteMany: {},
          },
        },
      });

      return ctx.prisma.vehicle.update({
        where: {
          id: input.vehicle.id,
          routeId: input.routeId,
        },
        data: {
          endAddressId: endAddress.id,
          shiftStart: input.vehicle.shiftStart,
          shiftEnd: input.vehicle.shiftEnd,
          cargo: input.vehicle.cargo ?? "",
          notes: input.vehicle.notes ?? "",
          capacity: input.vehicle.capacity,
          maxTasks: input.vehicle.maxTasks,
          maxTravelTime: input.vehicle.maxTravelTime,
          maxDistance: input.vehicle.maxDistance,
          breaks: {
            create: input.vehicle?.breaks?.map((b) => ({
              duration: b?.duration ?? 1800, //30 minutes in seconds
              start: b?.start ?? input.vehicle.shiftStart,
              end: b?.end ?? input.vehicle.shiftEnd,
            })),
          },
        },
      });
    }),

  getDepotDrivers: protectedProcedure
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
              endAddress: true,
              breaks: true,
            },
          },
        },
      });

      //Format into the DriverVehicleBundle type
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

  getRouteVehicles: protectedProcedure
    .input(z.object({ routeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const vehicles = await ctx.prisma.vehicle.findMany({
        where: {
          routeId: input.routeId,
        },
        include: {
          startAddress: true,
          endAddress: true,
          breaks: true,
          driver: {
            include: {
              address: true,
            },
          },
        },
      });

      //Format into the DriverVehicleBundle type
      const bundles = vehicles.map((vehicle) => ({
        driver: vehicle.driver,
        vehicle,
      }));

      return bundles as DriverVehicleBundle[];
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
