import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { RouteData } from "~/components/tools/routing/types";
import { env } from "~/env.mjs";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: "us2",
  useTLS: true,
});

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
    const { userId, latitude, longitude, accuracy, removeUser, fileId, route } =
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
