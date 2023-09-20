import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const passcodeRouter = createTRPCRouter({
  checkPassCode: publicProcedure
    .input(z.object({ passcode: z.string() }))
    .mutation(({ input }) => {
      if (input.passcode === "monkey") {
        return true;
      }
      return false;
    }),
});
