import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const depotsRouter = createTRPCRouter({
  //   getAllShops: protectedProcedure.query(({ ctx }) => {
  //     return ctx.prisma.routeDepot.findMany({
  //       where: {
  //         users: {

  //         }
  //       },
  //     });
  //   }),

  //   getShop: protectedProcedure
  //     .input(z.object({ shopId: z.string() }))
  //     .query(({ ctx, input }) => {
  //       return ctx.prisma.shop.findUnique({
  //         where: {
  //           id: input.shopId,
  //           ownerId: ctx.session.user.id,
  //         },
  //       });
  //     }),
  getCurrentUserDepot: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.routeDepot.findFirst({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),
  createDepot: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
        coordinates: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name is required",
        });
      if (!input.address)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "address is required",
        });
      if (!input.coordinates)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "coordinates are required",
        });
      return ctx.prisma.routeDepot.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
          address: input.address,
          city: "",
          state: "",
          zip: "",
          country: "",
          lat: input.coordinates?.lat ?? 0,
          lng: input.coordinates?.lng ?? 0,
        },
      });
    }),

  //   updateShop: protectedProcedure
  //     .input(
  //       z.object({
  //         shopId: z.string(),
  //         shopName: z.string(),
  //         ownerName: z.string(),
  //         bio: z.string().optional().or(z.null()),
  //         description: z.string().optional().or(z.null()),
  //         logoPhoto: z.string().optional().or(z.null()),
  //         country: z.string().optional().or(z.null()),
  //         address: z.string().optional().or(z.null()),
  //         city: z.string().optional().or(z.null()),
  //         state: z.string().optional().or(z.null()),
  //         zip: z.string().optional().or(z.null()),
  //         phone: z.string().optional().or(z.null()),
  //         email: z.string().optional().or(z.null()),
  //         website: z.string().optional().or(z.null()),
  //       })
  //     )
  //     .mutation(({ ctx, input }) => {
  //       if (!input.shopName)
  //         throw new TRPCError({
  //           code: "BAD_REQUEST",
  //           message: "Name is required",
  //         });

  //       if (!input.shopId)
  //         throw new TRPCError({
  //           code: "BAD_REQUEST",
  //           message: "Shop id is required",
  //         });

  //       return ctx.prisma.shop
  //         .findFirst({
  //           where: {
  //             id: input.shopId,
  //             ownerId: ctx.session.user.id,
  //           },
  //         })
  //         .then((shopByUserId) => {
  //           if (!shopByUserId) {
  //             throw new TRPCError({
  //               code: "UNAUTHORIZED",
  //               message: "Shop id does not belong to current user",
  //             });
  //           }
  //         })
  //         .then(() => {
  //           return ctx.prisma.shop.update({
  //             where: {
  //               id: input.shopId,
  //             },
  //             data: {
  //               shopName: input.shopName,
  //               ownerName: input.ownerName,
  //               bio: input?.bio ?? "",
  //               description: input?.description ?? "",
  //               logoPhoto: input?.logoPhoto ?? "",
  //               address: input?.address ?? "",
  //               city: input?.city ?? "",
  //               state: input?.state ?? "",
  //               zip: input?.zip ?? "",

  //               country: input?.country ?? "",
  //               phone: input?.phone ?? "",
  //               email: input?.email ?? "",
  //               website: input?.website ?? "",
  //             },
  //           });
  //         })
  //         .catch((err) => {
  //           throw new TRPCError({
  //             code: "INTERNAL_SERVER_ERROR",
  //             message: "Something went wrong. Please try again later.",
  //             cause: err,
  //           });
  //         });
  //     }),

  deleteDepot: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.depotId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Depot id is required",
        });

      return ctx.prisma.routeDepot
        .findFirst({
          where: {
            id: input.depotId,
            ownerId: ctx.session.user.id,
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
              id: input.depotId,
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
