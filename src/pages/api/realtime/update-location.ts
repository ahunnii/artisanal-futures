import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import type { RouteData } from "~/apps/solidarity-routing/types";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

// import { pusher } from "~/server/pusher/client";
import { pusherServer } from "~/server/soketi/server";

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  removeUser?: boolean;
  fileId?: string;
  route: RouteData;
};

const locationHandling = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { latitude, longitude, pathId } = req.body;

    if (!latitude || !longitude || !pathId) {
      res.status(400).send("Invalid request");
      return;
    }

    const optimizedPath = await prisma.optimizedRoutePath.findUnique({
      where: {
        id: pathId,
      },
    });

    if (!optimizedPath) {
      res.status(400).send("Invalid optimizied path");
      return;
    }

    const driver = await prisma.vehicle.findFirst({
      where: {
        id: optimizedPath?.vehicleId,
      },
      include: {
        driver: true,
      },
    });

    if (!driver) {
      res.status(400).send("No driver found");
      return;
    }

    // Trigger a Pusher event with the updated locations
    await pusherServer.trigger("map", "evt::update-location", {
      vehicleId: optimizedPath?.vehicleId,
      latitude,
      longitude,
    });
    res.status(200).send("Location updated");
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default locationHandling;
