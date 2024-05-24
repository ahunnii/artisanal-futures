import PusherClient from "pusher-js";
import { env } from "~/env.mjs";

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: "",
  httpHost: env.NEXT_PUBLIC_PUSHER_HOST,
  httpPort: env.NEXT_PUBLIC_PUSHER_PORT
    ? Number(env.NEXT_PUBLIC_PUSHER_PORT)
    : undefined,
  wsHost: env.NEXT_PUBLIC_PUSHER_HOST,
  wsPort: env.NEXT_PUBLIC_PUSHER_PORT
    ? Number(env.NEXT_PUBLIC_PUSHER_PORT)
    : undefined,
  wssPort: env.NEXT_PUBLIC_PUSHER_PORT
    ? Number(env.NEXT_PUBLIC_PUSHER_PORT)
    : undefined,
  forceTLS: env.NEXT_PUBLIC_PUSHER_PORT ? false : true,
  enabledTransports: ["ws", "wss"],
  authTransport: "ajax",
  authEndpoint: "/api/pusher-auth",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
