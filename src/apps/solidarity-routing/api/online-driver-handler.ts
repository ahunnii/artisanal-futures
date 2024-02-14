import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { PusherMessage } from "~/apps/solidarity-routing/types";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { pusherServer } from "~/server/soketi/server";

const onlineDriverHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) throw new Error("No user id");

    const { depotId, driverId, vehicleId } = req.body;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId },
      include: { driver: true },
    });

    if (!vehicle) return res.status(200).send("Driver not found");

    const message = `${vehicle?.driver?.name} is online`;

    // Create notification in database?

    console.log(message);
    // Trigger a Pusher event with the updated locations
    await pusherServer.trigger("map", `evt::notify-dispatch`, message);

    res.status(200).send("Location updated");
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default onlineDriverHandler;
