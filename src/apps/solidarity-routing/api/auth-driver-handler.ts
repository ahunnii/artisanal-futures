import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { serialize } from "cookie";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { generatePassCode } from "../utils/generic/generate-passcode";

const authDriverHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (session?.user && session?.user?.role === "ADMIN")
      res.status(200).send("Access Granted");

    const { depotId, driverId, email, magicCode } = req.body;

    if (!depotId || !driverId || !email || !magicCode)
      return res.status(400).send("Invalid request");

    const depot = await prisma.depot.findUnique({
      where: { id: depotId },
    });

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: driverId },
      include: { driver: true },
    });

    if (!depot) return res.status(400).send("Depot not found");
    if (!vehicle) return res.status(400).send("Driver not found");

    const depotMagicCode = generatePassCode(
      `${depot?.magicLink + vehicle?.driver?.email}`
    );
    const userMagicCode = generatePassCode(`${magicCode + email}`);

    if (depotMagicCode !== userMagicCode)
      return res.status(400).send("Invalid magic code");

    const twoMinutes = 60 * 2000;

    const cookie = serialize("verifiedDriver", "true", {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + twoMinutes),
    });

    const magicCookie = serialize("magicCode", depotMagicCode, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + twoMinutes),
    });
    res.setHeader("Set-Cookie", [cookie, magicCookie]);

    res.status(200).json({ magicCode: userMagicCode });
  } else if (req.method === "GET") {
    const cookie = req.cookies?.verifiedDriver;
    const code = req.cookies?.magicCode;
    if (cookie) {
      res.status(200).json({ magicCode: code });
    }
    res.status(400).send("Not verified");
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default authDriverHandler;
