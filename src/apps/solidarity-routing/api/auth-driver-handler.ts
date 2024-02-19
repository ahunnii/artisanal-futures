import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { serialize } from "cookie";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { generatePassCode } from "../utils/generic/generate-passcode";

const authDriverHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    const { depotId, driverId, email, magicCode } = req.body;

    console.log(depotId, driverId, email, magicCode);
    const depot = await prisma.depot.findUnique({
      where: { id: depotId },
    });

    if (!depot) return res.status(400).send("Depot not found");

    if (
      session?.user.id === depot.ownerId ||
      session?.user?.role === "ADMIN" ||
      session?.user?.role === "DRIVER"
    )
      res.status(200).send("Access Granted");

    if (!depotId || !driverId || !email || !magicCode)
      return res.status(400).send("Invalid request");

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: driverId },
      include: { driver: true },
    });

    if (!vehicle) return res.status(400).send("Driver not found");

    const depotMagicCode = generatePassCode(
      `${depot?.magicCode + vehicle?.driver?.email}`
    );
    const userMagicCode = generatePassCode(`${magicCode + email}`);

    if (depotMagicCode !== userMagicCode)
      return res.status(400).send("Invalid magic code");

    const tenMinutes = 60 * 10000;

    const cookie = serialize("verifiedDriver", "true", {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + tenMinutes),
    });

    res.setHeader("Set-Cookie", [cookie]);
    res.status(200).send("Access Granted");
  } else if (req.method === "GET") {
    const cookie = req.cookies?.verifiedDriver;

    if (cookie) {
      res.status(200).json({ error: null, pathId: cookie });
    } else {
      res.status(200).json({ error: "Driver not verified", pathId: null });
    }
  } else {
    res.status(405).send("Method not allowed");
  }
};
export default authDriverHandler;
