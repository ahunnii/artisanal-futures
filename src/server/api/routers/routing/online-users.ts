// import { Address } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { redis } from "~/server/redis/client";

export const clientsRouter = createTRPCRouter({
  //   getActiveDriverStatus: protectedProcedure
  //     .input(z.object({ depotId: z.number(), driverId: z.number() }))
  //     .query(async ({ ctx, input }) => {
  //       //Fisrt, check if user is added to online
  //       const cachedValue = await redis.get("online-drivers");
  //       if (cachedValue) {
  //         const onlineDrivers = JSON.parse(cachedValue);
  //         const driver = onlineDrivers.find(
  //           (driver) => driver.id === input.driverId
  //         );
  //         if (driver) {
  //           return driver;
  //         }
  //       }
  //       const driver = await ctx.prisma.driver.findFirst({
  //         where: {
  //           depotId: input.depotId,
  //           id: input.driverId,
  //         },
  //       });
  //       return driver;
  //     }),
});
