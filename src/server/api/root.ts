import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { commentRouter } from "./routers/comment";
import { passcodeRouter } from "./routers/passcode";
import { postRouter } from "./routers/post";
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
  passcode: passcodeRouter,
  auth: authRouter,
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
