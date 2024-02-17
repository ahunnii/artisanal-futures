import { RouteStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import {
  clientJobSchema,
  driverVehicleSchema,
  optimizationPlanSchema,
  type ClientJobBundle,
  type DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import { pusherServer } from "~/server/soketi/server";

import { appRouter } from "~/server/api/root";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { jobRouter } from "./jobs";

export const routePlanRouter = createTRPCRouter({
  setOptimizedData: protectedProcedure
    .input(z.object({ data: z.string(), routeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.route.update({
        where: {
          id: input.routeId,
        },
        data: {
          optimizedData: input.data,
        },
      });
    }),

  setOptimizedDataWithVroom: protectedProcedure
    .input(
      z.object({
        plan: optimizationPlanSchema,
        routeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.route.update({
        where: {
          id: input.routeId,
        },
        data: {
          optimizedRoute: {
            deleteMany: {},
          },
        },
      });
      const unassigned = input.plan.data.unassigned.map(
        (job) => job.description
      );

      const routes = input.plan.data.routes.map((route) => ({
        routeId: input.routeId,
        vehicleId: route.description,
        geoJson: route.geometry,
        stops: route.steps.map((step) => ({
          arrival: step.arrival,
          departure: step.arrival + (step.service + step.setup),
          duration: step.service + step.setup + step.waiting_time,
          prep: step.setup,
          type: step.type,
          jobId: step?.description ?? null,
          status: RouteStatus.PENDING,
        })),
      }));

      await ctx.prisma.job.updateMany({
        where: {
          routeId: input.routeId,
          id: {
            notIn: unassigned,
          },
        },
        data: {
          isOptimized: true,
        },
      });

      await Promise.all(
        routes.map(async (route) => {
          const totalDistance = route.stops.reduce((acc, stop, index) => {
            if (index === 0) return acc;
            const prevStop = route.stops[index - 1];
            return acc + (prevStop?.duration ?? 0);
          }, 0);

          const optimizedRoute = await ctx.prisma.optimizedRoutePath.create({
            data: {
              routeId: route.routeId,
              vehicleId: route.vehicleId,
              geoJson: route.geoJson,
              distance: totalDistance,
              startTime: route?.stops?.[0]?.arrival,
              endTime: route?.stops?.[route.stops.length - 1]?.departure,
            },
          });

          const stops = route.stops.map((stop) => ({
            ...stop,
            routePathId: optimizedRoute.id,
          }));

          await ctx.prisma.optimizedStop.createMany({
            data: stops,
          });

          return optimizedRoute;
        })
      );

      return ctx.prisma.route.update({
        where: {
          id: input.routeId,
        },
        data: {
          optimizedData: JSON.stringify(input.plan.data),
        },
      });
    }),

  updateOptimizedStopState: protectedProcedure
    .input(
      z.object({
        stopId: z.string(),
        state: z.nativeEnum(RouteStatus),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const optimizedStop = await ctx.prisma.optimizedStop.update({
        where: {
          id: input.stopId,
        },
        data: {
          status: input.state,
          notes: input.notes,
        },
        include: {
          job: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });

      await pusherServer.trigger(
        "map",
        `evt::invalidate-stops`,
        `Stop at ${optimizedStop?.job?.address?.formatted} was updated to ${input.state}`
      );

      return optimizedStop;
    }),

  updateOptimizedRoutePathStatus: protectedProcedure
    .input(
      z.object({
        pathId: z.string(),
        state: z.nativeEnum(RouteStatus),
        // notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const optimizedStop = ctx.prisma.optimizedRoutePath.update({
        where: {
          id: input.pathId,
        },
        data: {
          status: input.state,
        },
      });

      await pusherServer.trigger("map", `evt::invalidate-stops`, {});
      await pusherServer.trigger(
        "map",
        `evt::update-route-status`,
        `Route ${input.pathId} status was updated to ${input.state}`
      );

      return optimizedStop;
    }),

  getOptimizedStopsByAddress: protectedProcedure
    .input(z.object({ address: z.string(), optimizedRouteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const stops = await ctx.prisma.optimizedStop.findMany({
        where: {
          routePathId: input.optimizedRouteId,

          job: {
            address: {
              formatted: input.address,
            },
          },
        },
        include: {
          job: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });

      return stops;
    }),
  getOptimizedData: protectedProcedure
    .input(z.object({ pathId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.optimizedRoutePath.findUnique({
        where: {
          id: input.pathId,
        },
        include: {
          stops: true,
        },
      });
    }),

  getAllRoutes: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.route.findMany({
        where: {
          depotId: input.depotId,
        },
      });
    }),

  getRoutePlansByDate: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        depotId: z.string(),
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
          optimizedRoute: true,
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

  getStopsByDate: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        depotId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date(input.date.toISOString());
      const endDate = new Date(startDate);

      // Set start time to midnight (00:00:00)
      startDate.setHours(0, 0, 0, 0);

      // Set end time to 11:59:59
      endDate.setHours(23, 59, 59, 999);

      const routes = await ctx.prisma.route.findMany({
        where: {
          deliveryAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          jobs: {
            include: {
              address: true,
              client: {
                include: {
                  address: true,
                },
              },
            },
          },
        },
      });

      const stops = routes.flatMap((route) => route.jobs);
      const jobBundles = stops.map((job) => ({
        client: job.client,
        job: job,
      }));

      return jobBundles as unknown as ClientJobBundle[];
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
          optimizedRoute: {
            include: {
              stops: true,
              vehicle: {
                include: {
                  driver: true,
                },
              },
            },
          },
        },
      });
    }),

  createRoutePlan: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
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
            },
          });

          const endAddress = defaultVehicle?.endAddress?.formatted
            ? await ctx.prisma.address.create({
                data: {
                  formatted: defaultVehicle.endAddress.formatted,
                  latitude: defaultVehicle.endAddress.latitude,
                  longitude: defaultVehicle.endAddress.longitude,
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
        driver: vehicle.driver ?? null,
        vehicle: vehicle,
      }));

      return bundles as unknown as DriverVehicleBundle[];
    }),

  getJobBundles: protectedProcedure
    .input(z.object({ routeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.job.findMany({
        where: {
          routeId: input.routeId,
        },
        include: {
          address: true,
          client: {
            include: {
              address: true,
            },
          },
        },
      });
      const bundles = data.map((job) => ({
        client: job.client,
        job: job,
      })) as ClientJobBundle[];

      return bundles;
    }),
});
