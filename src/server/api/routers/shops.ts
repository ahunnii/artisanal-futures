import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const shopsRouter = createTRPCRouter({
  getAllValidShops: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shop.findMany({
      where: {
        shopName: { not: "" },
        OR: [{ logoPhoto: { not: "" } }, { ownerPhoto: { not: "" } }],
        website: { not: "" },
      },
    });
  }),
  getAllShops: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.shop.findMany();
  }),

  getAllCurrentUserShops: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.shop.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),

  getShopById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const shop = await ctx.prisma.shop.findUnique({
        where: {
          id: input.id,
        },
      });

      return shop;
    }),
  getShop: protectedProcedure
    .input(z.object({ shopId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.shop.findUnique({
        where: {
          id: input.shopId,
          ownerId: ctx.session.user.id,
        },
      });
    }),

  getCurrentUserShop: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.shop.findFirst({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
  createShop: protectedProcedure
    .input(
      z.object({
        shopName: z.string(),
        ownerId: z.string().optional(),
        ownerName: z.string().optional(),
        bio: z.string().optional().or(z.null()),
        description: z.string().optional().or(z.null()),
        logoPhoto: z.string().optional().or(z.null()),
        ownerPhoto: z.string().optional().or(z.null()),
        country: z.string().optional().or(z.null()),
        address: z.string().optional().or(z.null()),
        city: z.string().optional().or(z.null()),
        state: z.string().optional().or(z.null()),
        zip: z.string().optional().or(z.null()),
        phone: z.string().optional().or(z.null()),
        email: z.string().optional().or(z.null()),
        website: z.string().optional().or(z.null()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.shop.create({
        data: {
          shopName: input.shopName,
          ownerName: input.ownerName
            ? input.ownerName
            : ctx.session.user?.name ?? "",
          ownerId: input.ownerId ? input.ownerId : ctx.session.user.id,
          bio: input.bio ?? "",
          description: input.description ?? "",
          logoPhoto: input.logoPhoto ?? "",
          ownerPhoto: input.ownerPhoto ?? "",
          address: input.address ?? "",
          city: input.city ?? "",
          state: input.state ?? "",
          zip: input.zip ?? "",
          country: input.country ?? "",
          phone: input.phone ?? "",
          email: input.email ?? "",
          website: input.website ?? "",
        },
      });
    }),

  updateShop: protectedProcedure
    .input(
      z.object({
        shopId: z.string(),
        shopName: z.string(),
        ownerName: z.string(),
        ownerId: z.string().optional(),
        bio: z.string().optional().or(z.null()),
        description: z.string().optional().or(z.null()),
        logoPhoto: z.string().optional().or(z.null()),
        ownerPhoto: z.string().optional().or(z.null()),
        country: z.string().optional().or(z.null()),
        address: z.string().optional().or(z.null()),
        city: z.string().optional().or(z.null()),
        state: z.string().optional().or(z.null()),
        zip: z.string().optional().or(z.null()),
        phone: z.string().optional().or(z.null()),
        email: z.string().optional().or(z.null()),
        website: z.string().optional().or(z.null()),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.shopName)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });

      if (!input.shopId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Shop id is required",
        });

      return ctx.prisma.shop
        .findFirst({
          where: {
            id: input.shopId,
            ownerId: ctx.session.user.id,
          },
        })
        .then((shopByUserId) => {
          if (ctx.session.user.role !== "ADMIN" && !shopByUserId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Shop id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.shop.update({
            where: {
              id: input.shopId,
            },
            data: {
              shopName: input.shopName,
              ownerName: input.ownerName,
              bio: input?.bio ?? "",
              ownerId: input?.ownerId ?? ctx.session.user.id,
              description: input?.description ?? "",
              logoPhoto: input?.logoPhoto ?? "",
              ownerPhoto: input?.ownerPhoto ?? "",
              address: input?.address ?? "",
              city: input?.city ?? "",
              state: input?.state ?? "",
              zip: input?.zip ?? "",

              country: input?.country ?? "",
              phone: input?.phone ?? "",
              email: input?.email ?? "",
              website: input?.website ?? "",
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

  deleteShop: protectedProcedure
    .input(
      z.object({
        shopId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.shopId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Color id is required",
        });

      return ctx.prisma.shop
        .findFirst({
          where: {
            id: input.shopId,
            ownerId: ctx.session.user.id,
          },
        })
        .then((shopByUserId) => {
          if (ctx.session.user.role !== "ADMIN" && !shopByUserId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Shop id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.shop.delete({
            where: {
              id: input.shopId,
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
