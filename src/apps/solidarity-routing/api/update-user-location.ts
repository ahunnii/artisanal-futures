import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "~/server/db";

import { pusherServer } from "~/server/soketi/server";

const updateUserLocationHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
export default updateUserLocationHandler;
