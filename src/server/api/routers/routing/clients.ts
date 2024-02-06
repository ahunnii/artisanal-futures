// import { Address } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  ClientJobBundle,
  clientJobSchema,
} from "~/apps/solidarity-routing/types.wip";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const clientsRouter = createTRPCRouter({
  getDepotClients: protectedProcedure
    .input(z.object({ depotId: z.number() }))
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

  createManyClientAndJob: protectedProcedure
    .input(z.object({ data: z.array(clientJobSchema), depotId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const res = await Promise.all(
        input.data.map(async (clientJob) => {
          let address = null;
          if (clientJob.client.address) {
            address = await ctx.prisma.address.create({
              data: {
                formatted: clientJob.client.address.formatted,
                latitude: clientJob.client.address.latitude,
                longitude: clientJob.client.address.longitude,
                depotId: input.depotId,
              },
            });
          }

          const client = await ctx.prisma.client.create({
            data: {
              depotId: input.depotId,
              name: clientJob.client.name,
              email: clientJob.client.email,
              phone: clientJob.client.phone,
            },
          });

          const job = await ctx.prisma.job.create({
            data: {
              depotId: input.depotId,
              addressId: address?.id,
              timeWindowStart: clientJob.job.timeWindowStart,
              timeWindowEnd: clientJob.job.timeWindowEnd,
              type: clientJob.job.type,
              serviceTime: clientJob.job.serviceTime,
              prepTime: clientJob.job.prepTime,
              priority: clientJob.job.priority,
              notes: clientJob.job.notes,
            },
          });

          await ctx.prisma.client.update({
            where: {
              id: job.id,
            },
            data: {
              address: {
                connect: {
                  id: address?.id,
                },
              },
              defaultJobId: job.id,
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
            message: "Something happened while creating clients and jobs",
          });
        });

      return res;
    }),

  getCurrentDepotClients: protectedProcedure
    .input(z.object({ depotId: z.number() }))
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

  getCurrentDepotClientJobBundles: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .query(async ({ ctx, input }) => {
      const clients = await ctx.prisma.client.findMany({
        where: {
          depotId: input.depotId,
        },
        include: {
          address: true,
          jobs: {
            include: {
              address: true,
            },
          },
        },
      });

      const bundles = clients.map((client) => {
        const defaultJob = client.jobs?.find(
          (job) => job?.id === client?.defaultJobId
        );
        return {
          client,
          job: defaultJob,
        };
      });

      return bundles as ClientJobBundle[];
    }),

  deleteAllDepotClients: protectedProcedure
    .input(z.object({ depotId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const clients = await ctx.prisma.client.deleteMany({
        where: {
          depotId: input.depotId,
        },
      });

      return clients;
    }),
});
