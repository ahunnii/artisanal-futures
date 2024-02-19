import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { uploadImage } from "~/utils/forum/cloudinary";
export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `You are not authorized to perform this action`,
      });
    }
    const users = await ctx.prisma.user.findMany();

    return users;
  }),

  updateUserRole: protectedProcedure
    .input(z.object({ id: z.string(), role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not authorized to perform this action`,
        });
      }
      if (!Object.values(Role).includes(input.role as Role)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Role '${input.role}' does not exist`,
        });
      }
      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          role: input.role as Role,
        },
      });

      return user;
    }),

  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not authorized to perform this action`,
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: {
          accounts: true,
          sessions: true,
          posts: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No profile with id '${input.userId}'`,
        });
      }

      return user;
    }),

  getAllAccounts: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `You are not authorized to perform this action`,
      });
    }

    const accounts = await ctx.prisma.account.findMany({
      include: {
        user: true,
      },
    });

    return accounts;
  }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not authorized to perform this action`,
        });
      }
      const user = await ctx.prisma.user.delete({
        where: { id: input.id },
      });

      return user;
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not authorized to perform this action`,
        });
      }
      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      });

      return user;
    }),

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

      console.log(user);
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

  emojiList: protectedProcedure
    .input(z.object({}).nullable())
    .query(async ({}) => {
      const gemoji = (await import("gemoji")).gemoji;
      return gemoji;
    }),
  uploadImage: protectedProcedure
    .input(z.any())
    .mutation(async ({ input: file }) => {
      return uploadImage(file as File);
    }),
});
