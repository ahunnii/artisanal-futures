import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  profile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          image: true,
          title: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No profile with id '${id}'`,
        });
      }

      return user;
    }),

  edit: protectedProcedure
    .input(z.object({ name: z.string().min(1), title: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          title: input.title,
        },
      });

      return user;
    }),

  updateAvatar: protectedProcedure
    .input(z.object({ image: z.string().nullish() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          image: input.image,
        },
      });

      return user;
    }),

  mentionList: protectedProcedure
    .input(z.object({}).nullable())
    .query(({ ctx }) => {
      const users = ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return users;
    }),
});
