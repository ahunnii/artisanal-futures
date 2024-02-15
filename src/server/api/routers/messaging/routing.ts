import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const solidarityPathwaysMessagingRouter = createTRPCRouter({
  // bootstrapNewConversationAction
  createNewDepotServer: protectedProcedure
    .input(z.object({ ownerId: z.string(), depotId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { ownerId, depotId } = input;

      const owner = await ctx.prisma.user.findUnique({
        where: {
          id: ownerId,
        },
      });

      if (!owner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Owner not found",
        });
      }

      //First first, check if owner has a profile for messaging:
      const profile = await ctx.prisma.profile.upsert({
        where: {
          userId: ownerId,
        },
        update: {},
        create: {
          userId: ownerId,
          imageUrl: owner.image!,
          name: owner.name!,
          email: owner.email!,
        },
      });

      // Next, create the depot server
      const server = await ctx.prisma.server.upsert({
        where: { inviteCode: `depot-${depotId}` },
        update: {},
        create: {
          profileId: profile.id,
          inviteCode: `depot-${depotId}`,
          name: `Depot ${depotId} Server`,
          imageUrl: "",
        },
      });

      //Then add the drivers to the server (if there are any)

      const drivers = await ctx.prisma.driver.findMany({
        where: {
          depotId,
        },
      });

      // Create and add to server
      if (drivers.length > 0) {
        await Promise.all(
          drivers.map(async (driver) => {
            await ctx.prisma.profile.upsert({
              where: {
                driverId: driver.id,
              },
              update: {
                servers: {
                  connect: {
                    id: server.id,
                  },
                },
              },
              create: {
                email: driver.email,
                driverId: driver.id,
                name: driver.name,
                imageUrl: "",
                servers: {
                  connect: {
                    id: server.id,
                  },
                },
              },
            });
          })
        );
      }

      // Finally, create a channel for general posting within the depot
      const channel = await ctx.prisma.channel.create({
        data: {
          serverId: server.id,
          name: "General",
          profileId: profile.id,
        },
      });
      return { server, channel };
    }),
  // joinConversationAction
  joinDepotChannel: protectedProcedure
    .input(z.object({ driverId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      //Check if driver profile exists
      const driver = await ctx.prisma.driver.findUnique({
        where: {
          id: input.driverId,
        },
        include: {
          profile: true,
        },
      });

      if (!driver) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Driver not found",
        });
      }

      const driverProfile = driver.profile;
    }),

  // sendMessageAction
  sendDepotMessage: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      //
    }),
});

// export async function bootstrapNewConversationAction(userId: number) {
//   const conversation = await db
//     .insert(conversations)
//     .values({ name: nanoid() });

//   const conversationId = conversation.lastInsertRowid;

//   if (typeof conversationId !== "number") {
//     throw new Error("An error has occurred.");
//   }

//   const result = await db
//     .insert(participants)
//     .values({ userId, conversationId });

//   if (result.changes < 1) {
//     throw new Error("An error has occurred.");
//   }

//   redirect(`/conversations/${userId}/${conversationId}`);
// }

// export async function joinConversationAction(data: InvitationFormValues) {
//   const user = await db.query.users.findFirst({
//     where: (user, { eq }) => eq(user.username, data.username),
//   });

//   const userId = user?.id;

//   if (typeof userId !== "number") {
//     throw new Error("An error has occurred.");
//   }

//   const result = await db
//     .insert(participants)
//     .values({ userId, conversationId: data.chatId })
//     .onConflictDoNothing();

//   if (result.changes < 1) {
//     throw new Error("This username is already part of the chat");
//   }

//   redirect(`/conversations/${userId}/${data.chatId}`);
// }

// export async function sendMessageAction(data: TextFieldFormValues) {
//   const result = await db
//     .insert(messages)
//     .values({
//       conversationId: data.chatId,
//       senderId: data.userId,
//       body: data.body,
//     })
//     .returning();

//   for await (const item of result) {
//     await pusherServer.trigger(
//       data.chatId.toString(),
//       "evt::new-message",
//       item
//     );
//   }
// }
