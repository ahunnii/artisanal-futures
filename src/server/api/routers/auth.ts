import type { Role } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  changeRole: protectedProcedure
    .input(z.object({ role: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { role: input.role as Role },
      });
      return {
        response: `${ctx.session.user.name} was updated to ${ctx.session.user.role}`,
      };
    }),
});
