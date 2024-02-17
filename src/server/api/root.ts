import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { commentRouter } from "./routers/comment";

import { solidarityPathwaysMessagingRouter } from "./routers/messaging/routing";
import { postRouter } from "./routers/post";
import { productsRouter } from "./routers/products";

import { depotsRouter } from "./routers/routing/depots";
import { driversRouter } from "./routers/routing/drivers";

import { jobRouter } from "./routers/routing/jobs";
import { routePlanRouter } from "./routers/routing/route-plan";

import { shopsRouter } from "./routers/shops";
import { surveysRouter } from "./routers/surveys";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  shops: shopsRouter,
  surveys: surveysRouter,

  auth: authRouter,
  user: userRouter,
  post: postRouter,
  comment: commentRouter,

  products: productsRouter,

  drivers: driversRouter,
  depots: depotsRouter,
  jobs: jobRouter,
  routePlan: routePlanRouter,
  routeMessaging: solidarityPathwaysMessagingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
