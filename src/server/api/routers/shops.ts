import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shopsRouter = createTRPCRouter({
  getAllShops: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.shop.findMany({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),

  getShop: protectedProcedure
    .input(z.object({ shopId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.shop.findUnique({
        where: {
          id: input.shopId,
          ownerId: ctx.auth.userId,
        },
      });
    }),
  getCurrentUserShop: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.shop.findFirst({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),
  createShop: protectedProcedure
    .input(z.object({ shopName: z.string() }))
    .mutation(({ ctx, input }) => {
      return clerkClient.users.getUser(ctx.auth.userId).then((user) => {
        return ctx.prisma.shop.create({
          data: {
            shopName: input.shopName,
            ownerName: user?.firstName + " " + user?.lastName,
            ownerId: ctx.auth.userId,
            bio: "",
            description: "",
            logoPhoto: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            phone: "",
            email: "",
            website: "",
          },
        });
      });
    }),

  updateShop: protectedProcedure
    .input(
      z.object({
        shopId: z.string(),
        shopName: z.string(),
        ownerName: z.string(),
        bio: z.string().optional(),
        description: z.string().optional(),
        logoPhoto: z.string().optional(),
        country: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
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
            ownerId: ctx.auth.userId,
          },
        })
        .then((shopByUserId) => {
          if (!shopByUserId) {
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
              bio: input.bio,
              description: input.description,
              logoPhoto: input.logoPhoto,
              address: input.address,
              city: input.city,
              state: input.state,
              zip: input.zip,

              country: input.country,
              phone: input.phone,
              email: input.email,
              website: input.website,
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
            ownerId: ctx.auth.userId,
          },
        })
        .then((shopByUserId) => {
          if (!shopByUserId) {
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
