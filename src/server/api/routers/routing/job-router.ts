import { JobType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  clientJobSchema,
  clientSchema,
  jobSchema,
  type ClientJobBundle,
} from "~/apps/solidarity-routing/types.wip";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  // Batch create jobs (and possibly clients) for a route
  createJobBundles: protectedProcedure
    .input(
      z.object({
        bundles: z.array(clientJobSchema),
        depotId: z.string(),
        routeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await Promise.all(
        input.bundles.map(async (clientJob) => {
          // Then create the job itself
          const job = await ctx.prisma.job.create({
            data: {
              depotId: input.depotId,
              routeId: input.routeId,
              address: {
                create: {
                  formatted: clientJob.job.address.formatted,
                  latitude: clientJob.job.address.latitude,
                  longitude: clientJob.job.address.longitude,
                },
              },
              timeWindowStart: clientJob.job.timeWindowStart,
              timeWindowEnd: clientJob.job.timeWindowEnd,
              serviceTime: clientJob.job.serviceTime,
              prepTime: clientJob.job.prepTime,
              priority: clientJob.job.priority,
              type: clientJob.job.type,
              notes: clientJob.job.notes,
              order: clientJob.job.order,
            },
            include: {
              address: true,
            },
          });

          const clientAddress =
            clientJob?.client?.email !== undefined &&
            clientJob?.client?.email !== "" &&
            clientJob?.client?.email !== null
              ? await ctx.prisma.address.create({
                  data: {
                    formatted: clientJob.job.address.formatted,
                    latitude: clientJob.job.address.latitude,
                    longitude: clientJob.job.address.longitude,
                  },
                })
              : { id: undefined };

          // Next, check if client exists via email. If it does, assume updated info,
          // otherwise create a new client and link with new job
          // If no client info is provided, just create the job
          const client =
            clientJob?.client?.email !== undefined &&
            clientJob?.client?.email !== "" &&
            clientJob?.client?.email !== null
              ? await ctx.prisma.client.upsert({
                  where: {
                    email: clientJob.client.email,
                  },
                  update: {},
                  create: {
                    address: {
                      connect: {
                        id: clientAddress.id,
                      },
                    },
                    name: clientJob.client.name,
                    phone: clientJob.client.phone,
                    email: clientJob.client.email,
                    depotId: input.depotId,
                  },
                  include: {
                    address: true,
                  },
                })
              : {
                  id: undefined,
                };

          await ctx.prisma.job.update({
            where: {
              id: job.id,
            },
            data: {
              clientId: client.id,
            },
          });

          return { client, job } as ClientJobBundle;
        })
      )
        .then((data) => data)
        .catch((e) => {
          console.error(e);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something happened while creating the jobs and clients",
          });
        });

      return res;
    }),

  duplicateJobsToRoute: protectedProcedure
    .input(
      z.object({
        bundleIds: z.array(z.string()),
        depotId: z.string(),
        routeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await Promise.all(
        input.bundleIds.map(async (clientJob) => {
          // Then create the job itself

          const pastJob = await ctx.prisma.job.findUnique({
            where: {
              id: clientJob,
            },
            include: {
              address: true,
              client: true,
            },
          });

          if (!pastJob) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something happened while creating the jobs and clients",
            });
          }

          const job = await ctx.prisma.job.create({
            data: {
              depotId: input.depotId,
              routeId: input.routeId,
              address: {
                create: {
                  formatted: pastJob?.address!.formatted,
                  latitude: pastJob?.address!.latitude,
                  longitude: pastJob?.address!.longitude,
                },
              },
              timeWindowStart: pastJob?.timeWindowStart,
              timeWindowEnd: pastJob?.timeWindowEnd,
              serviceTime: pastJob?.serviceTime,
              prepTime: pastJob?.prepTime,
              priority: pastJob?.priority,
              type: pastJob?.type,
              notes: pastJob?.notes,
              order: pastJob?.order,
            },
            include: {
              address: true,
            },
          });

          const clientAddress =
            pastJob?.client?.email !== undefined &&
            pastJob?.client?.email !== "" &&
            pastJob?.client?.email !== null
              ? await ctx.prisma.address.create({
                  data: {
                    formatted: pastJob.address!.formatted,
                    latitude: pastJob.address!.latitude,
                    longitude: pastJob.address!.longitude,
                  },
                })
              : { id: undefined };

          // Next, check if client exists via email. If it does, assume updated info,
          // otherwise create a new client and link with new job
          // If no client info is provided, just create the job
          const client =
            pastJob?.client?.email !== undefined &&
            pastJob?.client?.email !== "" &&
            pastJob?.client?.email !== null
              ? await ctx.prisma.client.upsert({
                  where: {
                    email: pastJob.client.email,
                  },
                  update: {},
                  create: {
                    address: {
                      connect: {
                        id: clientAddress.id,
                      },
                    },
                    name: pastJob.client.name,
                    phone: pastJob.client.phone,
                    email: pastJob.client.email,
                    depotId: input.depotId,
                  },
                  include: {
                    address: true,
                  },
                })
              : {
                  id: undefined,
                };

          await ctx.prisma.job.update({
            where: {
              id: job.id,
            },
            data: {
              clientId: client.id,
            },
          });

          return { client, job } as ClientJobBundle;
        })
      )
        .then((data) => data)
        .catch((e) => {
          console.error(e);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something happened while creating the jobs and clients",
          });
        });

      return res;
    }),

  createRouteFromJobBundles: protectedProcedure
    .input(
      z.object({
        bundles: z.array(clientJobSchema),
        depotId: z.string(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const route = await ctx.prisma.route.create({
        data: {
          depotId: input.depotId,
          deliveryAt: input.date,
        },
      });

      if (!route) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something happened while creating the route",
        });
      }
      const res = await Promise.all(
        input.bundles.map(async (clientJob) => {
          // Then create the job itself
          const job = await ctx.prisma.job.create({
            data: {
              depotId: input.depotId,
              routeId: route.id,
              address: {
                create: {
                  formatted: clientJob.job.address.formatted,
                  latitude: clientJob.job.address.latitude,
                  longitude: clientJob.job.address.longitude,
                },
              },
              timeWindowStart: clientJob.job.timeWindowStart,
              timeWindowEnd: clientJob.job.timeWindowEnd,
              serviceTime: clientJob.job.serviceTime,
              prepTime: clientJob.job.prepTime,
              priority: clientJob.job.priority,
              type: clientJob.job.type,
              notes: clientJob.job.notes,
              order: clientJob.job.order,
            },
            include: {
              address: true,
            },
          });

          const clientAddress =
            clientJob?.client?.email !== undefined &&
            clientJob?.client?.email !== "" &&
            clientJob?.client?.email !== null
              ? await ctx.prisma.address.create({
                  data: {
                    formatted: clientJob.job.address.formatted,
                    latitude: clientJob.job.address.latitude,
                    longitude: clientJob.job.address.longitude,
                  },
                })
              : { id: undefined };

          // Next, check if client exists via email. If it does, assume updated info,
          // otherwise create a new client and link with new job
          // If no client info is provided, just create the job
          const client =
            clientJob?.client?.email !== undefined &&
            clientJob?.client?.email !== "" &&
            clientJob?.client?.email !== null
              ? await ctx.prisma.client.upsert({
                  where: {
                    email: clientJob.client.email,
                  },
                  update: {},
                  create: {
                    address: {
                      connect: {
                        id: clientAddress.id,
                      },
                    },
                    name: clientJob.client.name,
                    phone: clientJob.client.phone,
                    email: clientJob.client.email,
                    depotId: input.depotId,
                  },
                  include: {
                    address: true,
                  },
                })
              : {
                  id: undefined,
                };

          await ctx.prisma.job.update({
            where: { id: job.id },
            data: { clientId: client.id },
          });

          return { client, job } as ClientJobBundle;
        })
      )
        .then((data) => data)
        .catch((e) => {
          console.error(e);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something happened while creating the jobs and clients",
          });
        });

      return { res, route };
    }),

  updateRouteJob: protectedProcedure
    .input(z.object({ routeId: z.string(), job: jobSchema }))
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.prisma.job.update({
        where: {
          id: input.job.id,
          routeId: input.routeId,
        },
        data: {
          clientId: input.job.clientId,
          address: {
            upsert: {
              update: {
                formatted: input.job.address.formatted,
                latitude: input.job.address.latitude,
                longitude: input.job.address.longitude,
              },
              create: {
                formatted: input.job.address.formatted,
                latitude: input.job.address.latitude,
                longitude: input.job.address.longitude,
              },
            },
          },
          timeWindowStart: input.job.timeWindowStart,
          timeWindowEnd: input.job.timeWindowEnd,
          serviceTime: input.job.serviceTime,
          prepTime: input.job.prepTime,
          priority: input.job.priority,
          type: input.job.type,
          notes: input.job.notes,
          order: input.job.order,
        },
      });

      return job;
    }),

  updateDepotClient: protectedProcedure
    .input(z.object({ depotId: z.string(), client: clientSchema }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.prisma.client.update({
        where: {
          email: input.client.email,
        },
        data: {
          address: {
            upsert: {
              update: {
                formatted: input.client?.address?.formatted,
                latitude: input.client?.address?.latitude,
                longitude: input.client?.address?.longitude,
              },
              create: {
                formatted: input.client?.address?.formatted ?? "",
                latitude: input.client?.address?.latitude ?? 0,
                longitude: input.client?.address?.longitude ?? 0,
              },
            },
          },
          name: input.client.name,
          phone: input.client.phone,
          email: input.client.email,
          depotId: input.depotId,
        },
      });

      return client;
    }),

  getCurrentDepotJobs: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .query(async ({ ctx, input }) => {
      const jobs = await ctx.prisma.job.findMany({
        where: {
          depotId: input.depotId,
        },
        include: {
          address: true,
          client: true,
        },
      });

      return jobs;
    }),

  getCurrentDepotClients: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .query(async ({ ctx, input }) => {
      const clients = await ctx.prisma.client.findMany({
        where: {
          depotId: input.depotId,
        },
        include: {
          address: true,
          jobs: true,
        },
      });

      return clients;
    }),

  getClientById: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.prisma.client.findUnique({
        where: {
          id: input.clientId,
        },
        include: {
          address: true,
        },
      });

      return client;
    }),

  deleteClient: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.prisma.client.delete({
        where: {
          id: input.clientId,
        },
      });

      return client;
    }),

  deleteJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.prisma.job.delete({
        where: {
          id: input.jobId,
        },
      });

      return job;
    }),
  deleteJobFromRoute: protectedProcedure
    .input(z.object({ jobId: z.string(), routeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingJob = await ctx.prisma.job.findUnique({
        where: {
          id: input.jobId,
          routeId: input.routeId,
        },
      });

      if (!existingJob) return null;

      const job = await ctx.prisma.job.delete({
        where: {
          id: input.jobId,
          routeId: input.routeId,
        },
      });

      return job;
    }),
  deleteAllDepotJobs: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const jobs = await ctx.prisma.job.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return jobs;
    }),

  deleteAllDepotClients: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const clients = await ctx.prisma.client.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return clients;
    }),

  searchForJobs: protectedProcedure
    .input(z.object({ queryString: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.queryString === "") return [];

      const jobs = await ctx.prisma.job.findMany({
        where: {
          depotId: "clss4zhwb006ab5o24skoi3gh",
          OR: [
            { notes: { contains: input.queryString } },
            { order: { contains: input.queryString } },
            { client: { name: { contains: input.queryString } } },

            {
              client: {
                email: { contains: input.queryString },
              },
            },

            {
              client: {
                address: {
                  formatted: { contains: input.queryString },
                },
              },
            },
            {
              address: {
                formatted: { contains: input.queryString },
              },
            },
            {
              client: {
                phone: { contains: input.queryString },
              },
            },
          ],
        },
        include: {
          client: {
            include: { address: true },
          },
          address: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return jobs;
    }),
});
