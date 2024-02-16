import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { commentRouter } from "./routers/comment";

import { solidarityPathwaysMessagingRouter } from "./routers/messaging/routing";
import { postRouter } from "./routers/post";
import { productsRouter } from "./routers/products";
import { addressRouter } from "./routers/routing/addresses";
import { clientsRouter } from "./routers/routing/clients";
import { depotsRouter } from "./routers/routing/depots";
import { driversRouter } from "./routers/routing/drivers";
import { finalizedRouter } from "./routers/routing/finalized";
import { jobRouter } from "./routers/routing/jobs";
import { routePlanRouter } from "./routers/routing/route-plan";
import { vehicleRouter } from "./routers/routing/vehicles";
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
  routePlan: routePlanRouter,

  routeMessaging: solidarityPathwaysMessagingRouter,
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  depots: depotsRouter,

  products: productsRouter,
  finalizedRoutes: finalizedRouter,

  drivers: driversRouter,
  clients: clientsRouter,
  jobs: jobRouter,
  vehicles: vehicleRouter,
  addresses: addressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
