import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { driverVehicleSchema } from "~/apps/solidarity-routing/types.wip";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { pusherServer } from "~/server/soketi/server";

export const solidarityPathwaysMessagingRouter = createTRPCRouter({
  createNewDepotServer: protectedProcedure
    .input(z.object({ ownerId: z.string(), depotId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { ownerId, depotId } = input;

      const depotServer = await ctx.prisma.server.findUnique({
        where: {
          inviteCode: `depot-${depotId}`,
        },
      });

      if (depotServer) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message: "Depot server already exists",
        });
      }

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

      await ctx.prisma.member.create({
        data: {
          profileId: profile.id,
          serverId: server.id,
          role: "ADMIN",
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
            const driverProfile = await ctx.prisma.profile.upsert({
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

            await ctx.prisma.member.create({
              data: {
                profileId: driverProfile.id,
                serverId: server.id,
              },
            });

            await ctx.prisma.channel.create({
              data: {
                serverId: server.id,
                name: driver.email,
                profileId: profile.id,
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

      //Create the member status for each
      return { server, channel };
    }),

  createDriverChannels: protectedProcedure
    .input(z.object({ depotId: z.string(), bundles: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const server = await ctx.prisma.server.findUnique({
        where: {
          inviteCode: `depot-${input.depotId}`,
        },
      });

      if (!server) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Depot server not found",
        });
      }

      const ownerProfile = await ctx.prisma.profile.findUnique({
        where: {
          userId: ctx.session.user?.id,
        },
        include: {
          servers: true,
          members: true,
        },
      });

      if (!ownerProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Owner not found",
        });
      }

      // Create and add to server
      if (input.bundles.length > 0) {
        const res = await Promise.all(
          input.bundles.map(async (bundle) => {
            // if (!driver) {
            //   throw new TRPCError({
            //     code: "NOT_FOUND",
            //     message: "Driver not found",
            //   });
            // }

            // Create and add to server

            const driver = await ctx.prisma.driver.findUnique({
              where: {
                id: bundle,
              },
            });

            if (!driver) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Driver not found",
              });
            }

            const driverProfile = await ctx.prisma.profile.upsert({
              where: {
                driverId: bundle,
              },
              update: {
                servers: {
                  connect: {
                    id: server.id,
                  },
                },
              },
              create: {
                email: driver?.email,
                driverId: driver?.id,
                name: driver?.name,
                imageUrl: "",
                servers: {
                  connect: {
                    id: server.id,
                  },
                },
              },
              include: {
                members: true,
                channels: true,
              },
            });

            let member = driverProfile.members.find(
              (m) => m.serverId === server.id
            );

            if (!member) {
              member = await ctx.prisma.member.create({
                data: {
                  profileId: driverProfile.id,
                  serverId: server.id,
                },
              });
            }

            let channel = driverProfile.channels.find(
              (c) => c.name === driver?.email
            );

            if (!channel) {
              channel = await ctx.prisma.channel.create({
                data: {
                  serverId: server.id,
                  name: driver?.email,
                  profileId: ownerProfile.id,
                },
              });
            }

            return channel;
          })
        )
          .then((data) => data)
          .catch((err) => {
            console.error(err);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something happened while creating drivers and vehicles",
            });
          });

        return res;
      }
    }),

  getDepotGeneralChannel: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .query(async ({ input, ctx }) => {
      const depotServer = await ctx.prisma.server.findUnique({
        where: {
          inviteCode: `depot-${input.depotId}`,
        },
        include: {
          channels: {
            include: {
              messages: true,
            },
          },
        },
      });

      if (!depotServer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Depot server not found",
        });
      }

      return depotServer.channels.find((channel) => channel.name === "General");
    }),

  getDepotDriverChannel: protectedProcedure
    .input(z.object({ depotId: z.string(), driverId: z.string() }))
    .query(async ({ input, ctx }) => {
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

      const depotServer = await ctx.prisma.server.findUnique({
        where: {
          inviteCode: `depot-${input.depotId}`,
        },
        include: {
          channels: {
            include: {
              messages: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          },
        },
      });

      if (!depotServer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Depot server not found",
        });
      }

      return depotServer.channels.find(
        (channel) => channel.name === driver.email
      );
    }),

  getMember: protectedProcedure
    .input(
      z.object({
        driverId: z.string().optional(),
        ownerId: z.string().optional(),
        depotId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { driverId, ownerId, depotId } = input;

      const server = await ctx.prisma.server.findUnique({
        where: {
          inviteCode: `depot-${depotId}`,
        },
      });

      if (driverId) {
        const driverProfile = await ctx.prisma.profile.findUnique({
          where: {
            driverId,
          },
          include: {
            servers: true,
            members: true,
          },
        });

        if (!driverProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Driver not found",
          });
        }

        return driverProfile.members.find(
          (member) => member.serverId === server?.id
        );
      }

      if (ownerId) {
        const ownerProfile = await ctx.prisma.profile.findUnique({
          where: {
            userId: ownerId,
          },
          include: {
            servers: true,
            members: true,
          },
        });

        if (!ownerProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Owner not found",
          });
        }

        return ownerProfile.members.find(
          (member) => member.serverId === server?.id
        );
      }

      const ownerProfile = await ctx.prisma.profile.findUnique({
        where: {
          userId: ctx.session.user?.id,
        },
        include: {
          servers: true,
          members: true,
        },
      });

      if (!ownerProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Owner not found",
        });
      }

      return ownerProfile.members.find(
        (member) => member.serverId === server?.id
      );
    }),

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

  sendDriverChannelMessage: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        message: z.string(),
        memberId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.prisma.message.create({
        data: {
          channelId: input.channelId,
          content: input.message,
          memberId: input.memberId,
          unread: true,
        },
      });
      await pusherServer.trigger("map", `evt::invalidate-messages`, {});

      return message;
    }),

  getMessageProfile: protectedProcedure
    .input(
      z.object({
        driverId: z.string().optional(),
        routeId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const vehicles = await ctx.prisma.vehicle.findMany({
        where: {
          routeId: input.routeId,
        },
        include: {
          driver: {
            include: {
              profile: true,
            },
          },
        },
      });

      const ownerProfile = await ctx.prisma.profile.findUnique({
        where: {
          userId: ctx.session.user?.id,
        },
        include: {
          servers: true,
          members: true,
          channels: {
            include: {
              messages: true,
            },
          },
        },
      });

      if (!ownerProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Owner not found",
        });
      }

      return ownerProfile?.channels
        .filter((channel) => {
          return channel.messages.find((message) => message.unread);
        })
        .map((channel) => ({
          id: channel.id,
          channel: channel.name,
          messages: channel.messages.filter((message) => message.unread).length,
          driverId:
            vehicles.find((vehicle) => vehicle?.driver?.email === channel.name)
              ?.id ?? "",
        }));
    }),

  updateMessageReadState: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const messages = await ctx.prisma.message.updateMany({
        where: {
          channelId: input.channelId,
          unread: true,
        },
        data: {
          unread: false,
        },
      });

      return messages;
    }),

  // getDriverChannelMessages: protectedProcedure
  // .input(
  //   z.object({
  //     channelId: z.string(),

  //   })
  // )
  // .query(async ({ input, ctx }) => {
  //   const message = await ctx.prisma.message.findMany({
  //     data: {
  //       channelId: input.channelId,
  //       content: input.message,
  //       memberId: input.memberId,
  //     },
  //   });

  //   return message;
  // }),
  nukeEverything: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.profile.deleteMany();
    return ctx.prisma.server.deleteMany({
      where: {
        inviteCode: {
          startsWith: "depot-",
        },
      },
    });
  }),
});
