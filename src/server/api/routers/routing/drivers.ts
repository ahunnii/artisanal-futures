// import { Address } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  driverVehicleSchema,
  vehicleSchema,
  type DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
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

  createVehicleBundles: protectedProcedure
    .input(
      z.object({
        data: z.array(driverVehicleSchema),
        depotId: z.number(),
        routeId: z.string().optional(),
      })
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

          //Connect default vehicle to driver
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

          //If routeId is provided, connect new  vehicle to route
          if (input.routeId) {
            const routeAddress = await ctx.prisma.address.create({
              data: {
                formatted: driverVehicle.driver.address.formatted,
                latitude: driverVehicle.driver.address.latitude,
                longitude: driverVehicle.driver.address.longitude,
                depotId: input.depotId,
              },
            });

            const routeVehicle = await ctx.prisma.vehicle.create({
              data: {
                depotId: input.depotId,
                driverId: driver.id,
                startAddressId: routeAddress.id,
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

  createSingleDriverAndVehicleBundle: protectedProcedure
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

  // updateDriverDefaultVehicleByData: protectedProcedure
  //   .input(
  //     z.object({
  //       depotId: z.number(),
  //       driverId: z.string(),
  //       vehicle: vehicleSchema,
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const vehicle = await ctx.prisma.vehicle.create({
  //       data: {
  //         depotId: input.depotId,

  //         shiftStart: input.data.vehicle.shiftStart,
  //         shiftEnd: input.data.vehicle.shiftEnd,
  //         type: input.data.vehicle.type,
  //         capacity: input.data.vehicle.capacity,
  //         maxTasks: input.data.vehicle.maxTasks,
  //         maxTravelTime: input.data.vehicle.maxTravelTime,
  //         maxDistance: input.data.vehicle.maxDistance,
  //         breaks: {
  //           create: input.data?.vehicle?.breaks?.map((b) => ({
  //             duration: b?.duration ?? 1800, //30 minutes in seconds
  //             start: b?.start ?? input.data.vehicle.shiftStart,
  //             end: b?.end ?? input.data.vehicle.shiftEnd,
  //           })),
  //         },
  //       },
  //     });

  //     const driver = await ctx.prisma.driver.update({
  //       where: {
  //         id: input.driverId,
  //       },
  //       data: {
  //         defaultVehicleId: input.vehicleId,
  //       },
  //     });

  //     return driver;
  //   }),

  getCurrentDepotDrivers: protectedProcedure
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

      return drivers;
    }),

  updateDriverDefaultVehicle: protectedProcedure
    .input(
      z.object({
        driverId: z.string(),
        depotId: z.number(),
        data: driverVehicleSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.address.create({
        data: {
          formatted: input.data.vehicle.startAddress.formatted,
          latitude: input.data.vehicle.startAddress.latitude,
          longitude: input.data.vehicle.startAddress.longitude,
          depotId: input.depotId,
        },
      });

      const vehicle = await ctx.prisma.vehicle.create({
        data: {
          depotId: input.depotId,

          startAddressId: address.id,
          shiftStart: input.data.vehicle.shiftStart,
          shiftEnd: input.data.vehicle.shiftEnd,
          cargo: input.data.vehicle.cargo ?? "",
          notes: input.data.vehicle.notes ?? "",

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
      return ctx.prisma.driver.update({
        where: {
          id: input.driverId,
        },
        data: {
          defaultVehicleId: vehicle.id,
          vehicles: {
            connect: {
              id: vehicle.id,
            },
          },
        },
      });
    }),

  updateRouteVehicle: protectedProcedure
    .input(
      z.object({
        vehicleId: z.string(),
        depotId: z.number(),
        data: driverVehicleSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Update driver and vehicle data
      await ctx.prisma.driver.update({
        where: {
          id: input.data.driver.id,
        },
        data: {
          email: input.data.driver.email,
          phone: input.data.driver.phone,
          name: input.data.driver.name,
          type: input.data.driver.type,
        },
      });

      const address = await ctx.prisma.address.create({
        data: {
          formatted: input.data.vehicle.startAddress.formatted,
          latitude: input.data.vehicle.startAddress.latitude,
          longitude: input.data.vehicle.startAddress.longitude,
          depotId: input.depotId,
        },
      });

      await ctx.prisma.vehicle.update({
        where: {
          id: input.vehicleId,
        },
        data: {
          depotId: input.depotId,
          startAddressId: address.id,
          shiftStart: input.data.vehicle.shiftStart,
          shiftEnd: input.data.vehicle.shiftEnd,
          cargo: input.data.vehicle.cargo ?? "",
          notes: input.data.vehicle.notes ?? "",

          capacity: input.data.vehicle.capacity,
          maxTasks: input.data.vehicle.maxTasks,
          maxTravelTime: input.data.vehicle.maxTravelTime,
          maxDistance: input.data.vehicle.maxDistance,
          breaks: {
            deleteMany: {},
          },
        },
      });

      return ctx.prisma.vehicle.update({
        where: {
          id: input.vehicleId,
        },
        data: {
          breaks: {
            create: input.data?.vehicle?.breaks?.map((b) => ({
              duration: b?.duration ?? 1800, //30 minutes in seconds
              start: b?.start ?? input.data.vehicle.shiftStart,
              end: b?.end ?? input.data.vehicle.shiftEnd,
            })),
          },
        },
      });
    }),

  getCurrentDepotDriverVehicleBundles: protectedProcedure
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

  deleteDriver: protectedProcedure
    .input(z.object({ driverId: z.string(), deleteVehicles: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.prisma.driver.findUnique({
        where: {
          id: input.driverId,
        },
        include: {
          vehicles: true,
        },
      });

      if (input.deleteVehicles && driver?.vehicles) {
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
    }),

  addDriversToDepot: protectedProcedure
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
});
