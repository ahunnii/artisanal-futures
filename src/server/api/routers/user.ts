import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  profile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.user
        .findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            image: true,
            title: true,
          },
        })
        .then((user) => {
          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `No profile with id '${id}'`,
            });
          }
        });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        title: z.string().nullish(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.auth.session?.userId },
        data: {
          name: input.name,
          title: input.title,
        },
      });
    }),

  updateAvatar: protectedProcedure
    .input(z.object({ image: z.string().nullish() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.auth.session?.userId },
        data: {
          image: input.image,
        },
      });
    }),

  mentionList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
});
