import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import onlineDriverHandler from "~/apps/solidarity-routing/api/auth-driver-handler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await onlineDriverHandler(req, res);
};
export default handler;
