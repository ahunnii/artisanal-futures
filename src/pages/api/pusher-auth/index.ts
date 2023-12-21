// app/api/pusher-auth/route.ts
import { pusherServer } from "~/server/soketi/server";

export async function POST(req: Request) {
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  const authResponse = pusherServer.authorizeChannel(socketId!, channelName!);

  return new Response(JSON.stringify(authResponse));
}
