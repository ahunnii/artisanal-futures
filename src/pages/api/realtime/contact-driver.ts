import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { PusherMessage } from "~/apps/solidarity-routing/types";

import { authOptions } from "~/server/auth";

// import { pusher } from "~/server/pusher/client";
import { pusherServer } from "~/server/soketi/server";

const messages: PusherMessage[] = [];

const contactHandling = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) throw new Error("No user id");

    const { role, routeId, message } = req.body;

    messages.push({
      userId: session.user.id,
      role,
      routeId,
      message,
    });

    // Trigger a Pusher event with the updated locations
    await pusherServer.trigger("map", `evt::contact-dispatch`, messages);
    res.status(200).send("Location updated");
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default contactHandling;
