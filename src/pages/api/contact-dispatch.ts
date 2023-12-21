import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

import { env } from "~/env.mjs";
import { pusherServer } from "~/server/soketi/server";

// const pusher = new Pusher({
//   appId: env.PUSHER_APP_ID,
//   key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
//   secret: env.PUSHER_APP_SECRET,
//   cluster: "us2",
//   useTLS: true,
// });

type Message = {
  userId: string;
  name: string;
  address: string;
  deliveryNotes: string;
  status?: "success" | "failed" | "pending";
};

const messages: Message[] = [];

const contactHandling = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { userId, deliveryNotes, status, route, address } = req.body;
    const { name } = JSON.parse((route.description as string) ?? "{}");
    // // Update the location of the user
    // messages = messages.filter((user) => user.userId !== userId);
    // if (!removeUser)
    messages.push({
      userId,
      name,
      deliveryNotes,
      status,
      address,
    });

    // Trigger a Pusher event with the updated locations
    await pusherServer.trigger("map", "update-messages", messages);
    res.status(200).send("Location updated");
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default contactHandling;
