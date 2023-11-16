import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import type { RouteData } from "~/components/tools/routing/types";

import { authOptions } from "~/server/auth";

import { pusher } from "~/server/pusher/client";

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  removeUser?: boolean;
  fileId?: string;
  route: RouteData;
};
let userLocations: UserLocation[] = [];
const locationHandling = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id ?? "0";

    const { latitude, longitude, accuracy, removeUser, fileId, route } =
      req.body;
    // Update the location of the user
    userLocations = userLocations.filter((user) => user.userId !== userId);

    if (!removeUser)
      userLocations.push({
        userId,
        latitude,
        longitude,
        accuracy,
        fileId,
        route,
      });

    // Trigger a Pusher event with the updated locations
    await pusher.trigger("map", "update-locations", userLocations);
    res.status(200).send("Location updated");
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default locationHandling;
