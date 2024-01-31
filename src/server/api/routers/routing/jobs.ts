import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
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
