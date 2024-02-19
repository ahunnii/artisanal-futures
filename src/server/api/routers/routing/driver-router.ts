import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  driverSchema,
  driverVehicleSchema,
  vehicleSchema,
  type DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const driverRouter = createTRPCRouter({
  setDepotVehicles: protectedProcedure
    .input(
      z.object({ data: z.array(driverVehicleSchema), depotId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.depot.update({
        where: { id: input.depotId },

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
          const driver = await ctx.prisma.driver.create({
            data: {
              depotId: input.depotId,
              name: driverVehicle.driver.name,
              email: driverVehicle.driver.email,
              phone: driverVehicle.driver.phone,
              address: {
                create: {
                  formatted: driverVehicle.driver.address.formatted,
                  latitude: driverVehicle.driver.address.latitude,
                  longitude: driverVehicle.driver.address.longitude,
                },
              },
            },
            include: {
              address: true,
            },
          });

          const vehicle = await ctx.prisma.vehicle.create({
            data: {
              depotId: input.depotId,
              startAddress: {
                create: {
                  formatted: driverVehicle.driver.address.formatted,
                  latitude: driverVehicle.driver.address.latitude,
                  longitude: driverVehicle.driver.address.longitude,
                },
              },
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
            include: {
              startAddress: true,
              endAddress: true,
            },
          });

          await ctx.prisma.driver.update({
            where: { id: driver.id },
            data: {
              vehicles: {
                connect: {
                  id: vehicle.id,
                },
              },
              defaultVehicleId: vehicle.id,
            },
          });

          return { driver, vehicle } as DriverVehicleBundle;
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
        depotId: z.string(),
        routeId: z.string().optional(),
        override: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await Promise.all(
        input.data.map(async (driverVehicle) => {
          //Create driver for depot
          const driver = await ctx.prisma.driver.create({
            data: {
              depotId: input.depotId,
              name: driverVehicle.driver.name,
              email: driverVehicle.driver.email,
              phone: driverVehicle.driver.phone,
              address: {
                create: {
                  formatted: driverVehicle.driver.address.formatted,
                  latitude: driverVehicle.driver.address.latitude,
                  longitude: driverVehicle.driver.address.longitude,
                },
              },
            },
            include: {
              address: true,
            },
          });

          //Create default vehicle for driver
          const vehicle = await ctx.prisma.vehicle.create({
            data: {
              depotId: input.depotId,

              startAddress: {
                create: {
                  formatted: driverVehicle.vehicle.startAddress.formatted,
                  latitude: driverVehicle.vehicle.startAddress.latitude,
                  longitude: driverVehicle.vehicle.startAddress.longitude,
                },
              },
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
            include: {
              startAddress: true,
              endAddress: true,
              breaks: true,
            },
          });

          //Connect default vehicle to driver
          await ctx.prisma.driver.update({
            where: { id: driver.id },
            data: {
              vehicles: {
                connect: {
                  id: vehicle.id,
                },
              },
              defaultVehicleId: vehicle.id,
            },
          });

          if (driverVehicle.vehicle.endAddress) {
            const endAddress = await ctx.prisma.address.create({
              data: {
                formatted: driverVehicle?.vehicle?.endAddress?.formatted,
                latitude: driverVehicle.vehicle.endAddress.latitude,
                longitude: driverVehicle.vehicle.endAddress.longitude,
              },
            });
            await ctx.prisma.vehicle.update({
              where: { id: vehicle.id },
              data: {
                endAddress: {
                  connect: {
                    id: endAddress.id,
                  },
                },
              },
            });
          }
          //If routeId is provided, connect new vehicle to route
          if (input.routeId) {
            const routeVehicle = await ctx.prisma.vehicle.create({
              data: {
                depotId: input.depotId,
                driverId: driver.id,
                startAddress: {
                  create: {
                    formatted: vehicle.startAddress!.formatted,
                    latitude: vehicle.startAddress!.latitude,
                    longitude: vehicle.startAddress!.longitude,
                  },
                },

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

            if (driverVehicle.vehicle.endAddress) {
              const routeEndAddress = await ctx.prisma.address.create({
                data: {
                  formatted: driverVehicle?.vehicle?.endAddress?.formatted,
                  latitude: driverVehicle.vehicle.endAddress.latitude,
                  longitude: driverVehicle.vehicle.endAddress.longitude,
                },
              });
              await ctx.prisma.vehicle.update({
                where: { id: routeVehicle.id },
                data: {
                  endAddress: {
                    connect: {
                      id: routeEndAddress.id,
                    },
                  },
                },
              });
            }

            await ctx.prisma.route.update({
              where: { id: input.routeId },
              data: {
                vehicles: {
                  connect: {
                    id: routeVehicle.id,
                  },
                },
              },
            });
          }

          return { driver, vehicle } as DriverVehicleBundle;
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
    .input(z.object({ vehicleId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.vehicle.delete({
        where: { id: input.vehicleId },
      });
    }),

  deleteDriver: protectedProcedure
    .input(z.object({ driverId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.driver.delete({
        where: { id: input.driverId },
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
        where: { id: input.driverId },
        include: { vehicles: true },
      });

      if (driver?.vehicles) {
        await ctx.prisma.vehicle.deleteMany({
          where: {
            id: {
              in: driver.vehicles.map((v) => v.id),
            },
          },
        });
      }

      return ctx.prisma.driver.delete({
        where: {
          id: input.driverId,
        },
      });
    }),

  updateDriverDefaults: protectedProcedure
    .input(
      z.object({
        defaultId: z.string(),
        depotId: z.string(),
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

      const updatedVehicle = await ctx.prisma.vehicle.update({
        where: {
          id: defaultVehicle.id,
        },
        data: {
          startAddress: {
            update: {
              formatted: input.bundle.vehicle.startAddress.formatted,
              latitude: input.bundle.vehicle.startAddress.latitude,
              longitude: input.bundle.vehicle.startAddress.longitude,
            },
          },

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

      if (!input.bundle.vehicle.endAddress) {
        return updatedVehicle;
      }

      return ctx.prisma.vehicle.update({
        where: {
          id: defaultVehicle.id,
        },
        data: {
          endAddress: {
            upsert: {
              create: {
                formatted: input.bundle.vehicle.endAddress.formatted,
                latitude: input.bundle.vehicle.endAddress.latitude,
                longitude: input.bundle.vehicle.endAddress.longitude,
              },
              update: {
                formatted: input.bundle.vehicle.endAddress.formatted,
                latitude: input.bundle.vehicle.endAddress.latitude,
                longitude: input.bundle.vehicle.endAddress.longitude,
              },
            },
          },
        },
      });
    }),

  updateDriverDetails: protectedProcedure
    .input(z.object({ driverId: z.string(), driver: driverSchema }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.driver.update({
        where: {
          id: input.driverId,
        },
        data: {
          name: input?.driver?.name,
          email: input?.driver?.email,
          phone: input?.driver?.phone,
          address: {
            upsert: {
              create: {
                formatted: input.driver?.address.formatted,
                latitude: input.driver?.address.latitude,
                longitude: input.driver?.address.longitude,
              },
              update: {
                formatted: input.driver?.address.formatted,
                latitude: input.driver?.address.latitude,
                longitude: input.driver?.address.longitude,
              },
            },
          },
        },
      });
    }),

  updateVehicleDetails: protectedProcedure
    .input(z.object({ vehicle: vehicleSchema, routeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
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

      const updatedVehicle = await ctx.prisma.vehicle.update({
        where: {
          id: input.vehicle.id,
          routeId: input.routeId,
        },
        data: {
          startAddress: {
            upsert: {
              update: {
                formatted: input.vehicle.startAddress.formatted,
                latitude: input.vehicle.startAddress.latitude,
                longitude: input.vehicle.startAddress.longitude,
              },
              create: {
                formatted: input.vehicle.startAddress.formatted,
                latitude: input.vehicle.startAddress.latitude,
                longitude: input.vehicle.startAddress.longitude,
              },
            },
          },

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

      if (!input.vehicle.endAddress) {
        return updatedVehicle;
      }

      return ctx.prisma.vehicle.update({
        where: {
          id: updatedVehicle.id,
        },
        data: {
          endAddress: {
            upsert: {
              update: {
                formatted: input.vehicle.endAddress.formatted,
                latitude: input.vehicle.endAddress.latitude,
                longitude: input.vehicle.endAddress.longitude,
              },
              create: {
                formatted: input.vehicle.endAddress.formatted,
                latitude: input.vehicle.endAddress.latitude,
                longitude: input.vehicle.endAddress.longitude,
              },
            },
          },
        },
      });
    }),

  getDepotDrivers: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input.depotId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Depot ID is required",
        });
      }

      const drivers = await ctx.prisma.driver.findMany({
        where: { depotId: input.depotId },
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
    .input(z.object({ depotId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const drivers = await ctx.prisma.driver.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return drivers;
    }),

  deleteAllVehicles: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const vehicle = await ctx.prisma.vehicle.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return vehicle;
    }),
});
