import PusherServer from "pusher";
import { env } from "~/env.mjs";

export const pusherServer = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: "",
  useTLS: env.NEXT_PUBLIC_PUSHER_PORT ? false : true,
  host: env.NEXT_PUBLIC_PUSHER_HOST,
  port: env.NEXT_PUBLIC_PUSHER_PORT ?? "",
});

// export const pusherServer = new PusherServer({
//     appId: env.PUSHER_APP_ID,
//     key: "app-key",
//     secret: "app-secret",
//     cluster: "",
//     useTLS: true,
//     host: "data.artisanalfutures.org",
//     // port: "443",
//   });
