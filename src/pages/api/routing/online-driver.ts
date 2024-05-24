import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import onlineDriverHandler from "~/apps/solidarity-routing/api/online-driver-handler";
import type { PusherMessage } from "~/apps/solidarity-routing/types";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { pusherServer } from "~/server/soketi/server";

const messages: PusherMessage[] = [];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await onlineDriverHandler(req, res);
};
export default handler;
