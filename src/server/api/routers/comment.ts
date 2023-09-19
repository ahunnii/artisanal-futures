import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { markdownToHtml } from "~/utils/forum/editor";

export const commentRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          author: {
            connect: {
              id: ctx.auth.userId,
            },
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          content: z.string().min(1),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, data } = input;

      return ctx.prisma.comment
        .findUnique({
          where: { id },
          select: {
            author: {
              select: {
                id: true,
              },
            },
          },
        })
        .then((comment) => {
          const commentBelongsToUser = comment?.author.id === ctx.auth.userId;

          if (!commentBelongsToUser) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          return ctx.prisma.comment.update({
            where: { id },
            data: {
              content: data.content,
              contentHtml: markdownToHtml(data.content),
            },
          });
        });
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) => {
      return ctx.prisma.comment
        .findUnique({
          where: { id },
          select: {
            author: {
              select: {
                id: true,
              },
            },
          },
        })
        .then((comment) => {
          const commentBelongsToUser = comment?.author.id === ctx.auth.userId;
          if (!commentBelongsToUser) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          return ctx.prisma.comment.delete({ where: { id } }).then(() => {
            return id;
          });
        });
    }),
});
