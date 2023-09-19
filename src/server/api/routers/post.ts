import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { markdownToHtml } from "~/utils/forum/editor";
import { postToSlackIfEnabled } from "~/utils/forum/slack";

export const postRouter = createTRPCRouter({
  feed: protectedProcedure
    .input(
      z
        .object({
          take: z.number().min(1).max(50).optional(),
          skip: z.number().min(1).optional(),
          authorId: z.string().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      const take = input?.take ?? 50;
      const skip = input?.skip;
      const where = {
        hidden: ctx.isUserAdmin ? undefined : false,
        authorId: input?.authorId,
      };

      return ctx.prisma.post
        .findMany({
          take,
          skip,
          orderBy: {
            createdAt: "desc",
          },
          where,
          select: {
            id: true,
            title: true,
            contentHtml: true,
            createdAt: true,
            hidden: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likedBy: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
        })
        .then((posts) => {
          return ctx.prisma.post
            .count({
              where,
            })
            .then((postCount) => {
              return {
                posts,
                postCount,
              };
            });
        });
    }),

  detail: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.post
        .findUnique({
          where: { id },
          select: {
            id: true,
            title: true,
            content: true,
            contentHtml: true,
            createdAt: true,
            hidden: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likedBy: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            comments: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                id: true,
                content: true,
                contentHtml: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        })
        .then((post) => {
          const postBelongsToUser = post?.author.id === ctx.auth.userId;

          if (
            !post ||
            (post.hidden && !postBelongsToUser && !ctx.isUserAdmin)
          ) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `No post with id '${id}'`,
            });
          }

          return post;
        });
    }),

  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        take: 10,
        where: {
          hidden: false,
          title: { search: input.query },
          content: { search: input.query },
        },
        select: {
          id: true,
          title: true,
        },
      });
    }),

  add: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .query(({ ctx, input }) => {
      ctx.prisma.post
        .create({
          data: {
            title: input.title,
            content: input.content,
            contentHtml: markdownToHtml(input.content),
            author: {
              connect: {
                id: ctx.auth.userId,
              },
            },
          },
        })
        .then((post) => {
          return postToSlackIfEnabled({
            post,
            authorName:
              ctx.auth.user?.firstName + " " + ctx.auth.user?.lastName,
          }).then(() => {
            return post;
          });
        });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, data } = input;
      ctx.prisma.post
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
        .then((post) => {
          const postBelongsToUser = post?.author.id === ctx.auth.userId;
          if (!postBelongsToUser) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          return ctx.prisma.post.update({
            where: { id },
            data: {
              title: data.title,
              content: data.content,
              contentHtml: markdownToHtml(data.content),
            },
          });
        });
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) => {
      return ctx.prisma.post
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
        .then((post) => {
          const postBelongsToUser = post?.author.id === ctx.auth.userId;

          if (!postBelongsToUser) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
          return ctx.prisma.post.delete({ where: { id } });
        });
    }),

  like: protectedProcedure.input(z.number()).mutation(({ ctx, input: id }) => {
    return ctx.prisma.likedPosts
      .create({
        data: {
          post: {
            connect: {
              id,
            },
          },
          user: {
            connect: {
              id: ctx.auth.userId,
            },
          },
        },
      })
      .then(() => {
        return id;
      });
  }),

  unlike: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) => {
      return ctx.prisma.likedPosts
        .delete({
          where: {
            postId_userId: {
              postId: id,
              userId: ctx.auth.userId,
            },
          },
        })
        .then(() => {
          return id;
        });
    }),

  hide: protectedProcedure.input(z.number()).mutation(({ ctx, input: id }) => {
    if (!ctx.isUserAdmin) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return ctx.prisma.post.update({
      where: { id },
      data: {
        hidden: true,
      },
      select: {
        id: true,
      },
    });
  }),

  unhide: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input: id }) => {
      if (!ctx.isUserAdmin) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.prisma.post.update({
        where: { id },
        data: {
          hidden: false,
        },
        select: {
          id: true,
        },
      });
    }),
});
