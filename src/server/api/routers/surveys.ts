import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const surveysRouter = createTRPCRouter({
  // getAllShops: protectedProcedure.query(({ ctx }) => {
  //   return ctx.prisma.shop.findMany({
  //     where: {
  //       ownerId: ctx.auth.userId,
  //     },
  //   });
  // }),

  getSurvey: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.survey.findUnique({
        where: {
          id: input.surveyId,
          ownerId: ctx.auth.userId,
        },
      });
    }),
  getCurrentUserSurvey: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.survey.findFirst({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),
  createSurvey: protectedProcedure
    .input(z.object({ shopId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.survey.create({
        data: {
          shopId: input.shopId,
          ownerId: ctx.auth.userId,
        },
      });
    }),

  updateSurvey: protectedProcedure
    .input(
      z.object({
        surveyId: z.string(),

        processes: z.string().optional(),
        materials: z.string().optional(),
        principles: z.string().optional(),
        unmoderatedForm: z.boolean().default(false),
        moderatedForm: z.boolean().default(false),
        hiddenForm: z.boolean().default(false),
        privateForm: z.boolean().default(false),
        supplyChain: z.boolean().default(false),
        messagingOptIn: z.boolean().default(false),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.surveyId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Shop id is required",
        });

      return ctx.prisma.survey
        .findFirst({
          where: {
            id: input.surveyId,
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
          return ctx.prisma.survey.update({
            where: {
              id: input.surveyId,
            },
            data: {
              processes: input.processes,
              materials: input.materials,
              principles: input.principles,
              unmoderatedForm: input.unmoderatedForm,
              moderatedForm: input.moderatedForm,
              hiddenForm: input.hiddenForm,
              privateForm: input.privateForm,
              supplyChain: input.supplyChain,
              messagingOptIn: input.messagingOptIn,
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

  deleteSurvey: protectedProcedure
    .input(
      z.object({
        surveyId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!input.surveyId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "surveyId is required",
        });

      return ctx.prisma.survey
        .findFirst({
          where: {
            id: input.surveyId,
            ownerId: ctx.auth.userId,
          },
        })
        .then((shopByUserId) => {
          if (!shopByUserId) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "survey id does not belong to current user",
            });
          }
        })
        .then(() => {
          return ctx.prisma.survey.delete({
            where: {
              id: input.surveyId,
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
