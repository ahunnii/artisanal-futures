import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { PusherMessage } from "~/components/tools/routing/types";

import { authOptions } from "~/server/auth";

import { pusher } from "~/server/pusher/client";

const messages: PusherMessage[] = [];

const contactHandling = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    const { deliveryNotes, status, route, address, routeId, stopId } = req.body;
    const { name } = JSON.parse((route.description as string) ?? "{}");

    messages.push({
      userId: session?.user?.id ?? "0",
      name,
      deliveryNotes,
      status,
      address,
      routeId,
      stopId,
    });

    // Trigger a Pusher event with the updated locations
    await pusher.trigger("map", "update-messages", messages);
    res.status(200).send("Location updated");
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default contactHandling;
