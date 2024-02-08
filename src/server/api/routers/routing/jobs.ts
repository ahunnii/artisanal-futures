import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { clientJobSchema } from "~/apps/solidarity-routing/types.wip";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  // Batch create jobs (and possibly clients) for a route
  createJobBundles: protectedProcedure
    .input(
      z.object({
        bundles: z.array(clientJobSchema),
        depotId: z.number(),
        routeId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await Promise.all(
        input.bundles.map(async (clientJob) => {
          // First, create the job address
          const address = await ctx.prisma.address.create({
            data: {
              formatted: clientJob.job.address.formatted,
              latitude: clientJob.job.address.latitude,
              longitude: clientJob.job.address.longitude,
              depotId: input.depotId,
            },
          });

          // Then create the job itself
          const job = await ctx.prisma.job.create({
            data: {
              depotId: input.depotId,
              routeId: input.routeId,
              addressId: address.id,
              timeWindowStart: clientJob.job.timeWindowStart,
              timeWindowEnd: clientJob.job.timeWindowEnd,
              serviceTime: clientJob.job.serviceTime,
              prepTime: clientJob.job.prepTime,
              priority: clientJob.job.priority,
              type: clientJob.job.type,
              notes: clientJob.job.notes,
              order: clientJob.job.order,
            },
          });

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
                    addressId: address.id,
                    name: clientJob.client.name,
                    phone: clientJob.client.phone,
                    email: clientJob.client.email,
                    depotId: input.depotId,
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

          return { client, job };
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

  getCurrentDepotJobs: protectedProcedure
    .input(z.object({ depotId: z.number() }))
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
  deleteAllDepotJobs: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const jobs = await ctx.prisma.job.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return jobs;
    }),
});
