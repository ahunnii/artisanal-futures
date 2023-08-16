import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  getAllStores: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.store.findMany({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),

  getStore: protectedProcedure
    .input(z.object({ storeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.store.findUnique({
        where: {
          id: input.storeId,
          ownerId: ctx.auth.userId,
        },
      });
    }),
  getCurrentUserStore: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.store.findFirst({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),
  createStore: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.store.create({
        data: {
          name: input.name,
          owner: ctx.auth.user?.firstName + " " + ctx.auth.user?.lastName,
          ownerId: ctx.auth.userId,
        },
      });
    }),

  updateStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
        name: z.string(),
        owner: z.string(),
        bio: z.string().optional(),
        description: z.string().optional(),
        logoImage: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });

      if (!input.storeId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Store id is required",
        });

      return ctx.prisma.store
        .findFirst({
          where: {
            id: input.storeId,
            ownerId: ctx.auth.userId,
          },
        })
        .then((storeByUserId) => {
          if (!storeByUserId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Store id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.store.update({
            where: {
              id: input.storeId,
            },
            data: {
              name: input.name,
              owner: input.owner,
              bio: input.bio,
              description: input.description,
              logoImage: input.logoImage,
            },
          });
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),

  deleteStore: protectedProcedure
    .input(
      z.object({
        storeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.storeId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Color id is required",
        });

      return ctx.prisma.store
        .findFirst({
          where: {
            id: input.storeId,
            ownerId: ctx.auth.userId,
          },
        })
        .then((storeByUserId) => {
          if (!storeByUserId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Store id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.store.delete({
            where: {
              id: input.storeId,
            },
          });
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
          });
        });
    }),
});
