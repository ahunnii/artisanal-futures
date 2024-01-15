import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const stepDataSchema = z.object({
  arrival: z.number(),
  distance: z.number(),
  duration: z.number(),
  load: z.array(z.number()),
  location: z.tuple([z.number(), z.number()]).optional(),
  location_index: z.number().optional(),
  service: z.number(),
  setup: z.number(),
  type: z.string(),
  violations: z.array(z.unknown()),
  waiting_time: z.number(),
  description: z.string().optional(),
  id: z.number().optional(),
  job: z.number().optional(),
});

export const routeDataSchema = z.object({
  amount: z.array(z.number()),
  cost: z.number(),
  delivery: z.array(z.number()),
  description: z.string(),
  distance: z.number(),
  duration: z.number(),
  geometry: z.string(),
  pickup: z.array(z.number()),
  priority: z.number(),
  service: z.number(),
  setup: z.number(),
  vehicle: z.number(),
  violations: z.array(z.unknown()),
  waiting_time: z.number(),
  steps: z.array(stepDataSchema),
});

export const expandedStepDataSchema = stepDataSchema.extend({
  status: z
    .union([z.literal("failed"), z.literal("success"), z.literal("pending")])
    .optional(),
  deliveryNotes: z.string().optional(),
});

export const expandedRouteDataSchema = routeDataSchema.extend({
  steps: z.array(expandedStepDataSchema),
  routeId: z.string().optional(),
});

export const finalizedRouter = createTRPCRouter({
  createFinalizedRoute: protectedProcedure
    .input(expandedRouteDataSchema)
    .mutation(async ({ ctx, input }) => {
      const temp = await ctx.prisma.finalizedRoute.findMany({
        where: {
          userId: ctx.session.user.id,
          route: {
            equals: input as Prisma.JsonObject,
          },
        },
      });

      if (temp.length > 0) {
        // console.log("match");
        // console.log(temp[0]?.id);
        return temp[0];
      }
      const route = await ctx.prisma.finalizedRoute.create({
        data: {
          userId: ctx.session.user.id,
          route: input as Prisma.JsonObject,
        },
      });

      // console.log(route.id);
      // console.log(route);
      return route;
    }),

  getAllFinalizedRoutes: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.finalizedRoute.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getFinalizedRoute: protectedProcedure
    .input(z.object({ routeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const route = await ctx.prisma.finalizedRoute.findUnique({
        where: {
          id: input.routeId,
        },
      });

      if (!route) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        route: route.route as unknown as ExpandedRouteData,
        steps: (route.route as unknown as ExpandedRouteData).steps,
      };
    }),
  getAllFormattedFinalizedRoutes: protectedProcedure
    .input(
      z
        .object({
          filterOut: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const routes = await ctx.prisma.finalizedRoute.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const fetchedRoutes = input?.filterOut
        ? routes.filter((route) => route.status !== input?.filterOut)
        : routes;

      const filteredDepotRoutes = fetchedRoutes.map((dbRoute) => {
        return {
          ...(dbRoute.route as unknown as ExpandedRouteData),
          routeId: dbRoute.id,
        };
      });

      return filteredDepotRoutes;
    }),
  updateFinalizedRouteStatus: protectedProcedure
    .input(
      z.object({
        routeId: z.string(),
        status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.finalizedRoute.update({
        where: {
          id: input.routeId,
        },
        data: {
          status: input.status,
        },
      });
    }),

  updateFinalizedRoute: protectedProcedure
    .input(
      z.object({
        route: expandedRouteDataSchema,
        routeId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.finalizedRoute.update({
        where: {
          id: input.routeId,
        },
        data: {
          route: input.route as Prisma.JsonObject,
        },
      });
    }),
});
