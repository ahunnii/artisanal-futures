import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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
              update: {},
              create: {
                email: driver?.email,
                driverId: driver?.id,
                name: driver?.name,
                imageUrl: "",
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

  updateDriverChannelByEmail: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
        email: z.string(),
        channelName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const channel = await ctx.prisma.channel.findFirst({
        where: {
          name: input.channelName,
        },
      });

      if (!channel) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Channel not found",
        });
      }

      return ctx.prisma.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          name: input.email,
        },
      });
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

  getAllDepotChannels: protectedProcedure
    .input(z.object({ depotId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!input.depotId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Depot id is needed",
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

      return depotServer.channels;
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

  getAllMembers: protectedProcedure
    .input(
      z.object({
        depotId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { depotId } = input;

      const server = await ctx.prisma.server.findUnique({
        where: {
          inviteCode: `depot-${depotId}`,
        },
        include: {
          members: {
            include: {
              profile: true,
            },
          },
        },
      });

      if (!server) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Server not found",
        });
      }

      return server.members;
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
  getDriverMessageProfile: protectedProcedure
    .input(z.object({ vehicleId: z.string() }))
    .query(async ({ input, ctx }) => {
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: {
          id: input.vehicleId,
        },
        include: {
          driver: true,
        },
      });

      if (!vehicle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "vehicle not found",
        });
      }

      const driverProfile = await ctx.prisma.profile.findUnique({
        where: {
          driverId: vehicle?.driver?.id,
        },
        include: {
          members: {
            include: {
              messages: {
                include: {
                  channel: true,
                },
              },
            },
          },
        },
      });

      return driverProfile;
      // .filter((channel) => {
      //   // return channel.messages.find((message) => message.unread);
      // })
      // .map((channel) => ({
      //   id: channel.id,
      //   channel: channel.name,
      //   messages: channel.messages.filter((message) => message.unread)
      //     .length,
      //   depotId: channel.server.name.split("Depot ")[1],
      //   driverId: driverProfile.driverId,
      // }))
    }),

  getUnreadMessagesByChannel: protectedProcedure
    .input(
      z.object({
        vehicleId: z.string().optional(),
        depotId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      let profile;

      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: {
          id: input?.vehicleId ?? "",
        },
        include: {
          driver: true,
        },
      });

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

      if ((!vehicle || !vehicle.driver) && input.vehicleId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehicle not found",
        });
      }

      if (input.vehicleId) {
        profile = await ctx.prisma.profile.findUnique({
          where: {
            driverId: vehicle?.driver?.id,
          },
          include: {
            members: {
              include: {
                messages: true,
              },
            },
          },
        });
      } else {
        profile = await ctx.prisma.profile.findUnique({
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            members: {
              include: {
                messages: true,
              },
            },
          },
        });
      }

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      if (!depotServer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "depot server not found",
        });
      }

      const member = await ctx.prisma.member.findFirst({
        where: {
          profileId: profile.id,
          serverId: depotServer?.id,
        },
      });

      const depot = await ctx.prisma.depot.findUnique({
        where: {
          id: input?.depotId,
        },
      });

      // get all channels
      // Check if their

      const channelsByServer = depotServer.channels.flatMap((server) => {
        return {
          unreadMessages: server.messages.filter(
            (message) => message.unread && message.memberId !== member?.id
          ),
          channel: server,
          serverId: server.serverId,
          profileId: profile.id,
          memberId: member?.id,
          depot: depot?.name ?? `# ${input?.depotId}`,
        };
      });

      console.log(channelsByServer);

      return {
        channelsByServer: channelsByServer.filter(
          (bundle) => bundle.unreadMessages.length > 0
        ),
        totalUnread: channelsByServer.reduce(
          (acc, curr) => acc + curr.unreadMessages.length,
          0
        ),
      };
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
        driverId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.driverId) {
        const vehicle = await ctx.prisma.vehicle.findUnique({
          where: {
            id: input.driverId,
          },
          include: {
            driver: true,
          },
        });
        if (!vehicle || !vehicle.driver) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Driver not found",
          });
        }

        return ctx.prisma.message.updateMany({
          where: {
            channelId: input.channelId,
            unread: true,
            member: {
              profile: {
                NOT: {
                  driverId: vehicle.driver.id,
                },
              },
            },
          },
          data: {
            unread: false,
          },
        });
      } else {
        return ctx.prisma.message.updateMany({
          where: {
            channelId: input.channelId,
            unread: true,
            member: {
              profile: {
                NOT: {
                  userId: ctx.session?.user?.id,
                },
              },
            },
          },
          data: {
            unread: false,
          },
        });
      }
    }),

  updateOtherMessageReadState: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
        profileId: z.string().optional(),
        memberId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.memberId && !input.profileId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Profile id or member id is needed",
        });
      }
      if (input.memberId) {
        return ctx.prisma.message.updateMany({
          where: {
            channelId: input.channelId,
            unread: true,
            member: {
              id: { not: input.memberId },
            },
          },
          data: {
            unread: false,
          },
        });
      }
      return ctx.prisma.message.updateMany({
        where: {
          channelId: input.channelId,
          unread: true,
          member: {
            profile: {
              id: { not: input.profileId },
            },
          },
        },
        data: {
          unread: false,
        },
      });
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
