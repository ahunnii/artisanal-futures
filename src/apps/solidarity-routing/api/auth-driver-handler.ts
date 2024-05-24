import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { serialize } from "cookie";

import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { generatePassCode } from "../utils/generic/generate-passcode";
import {
  createDriverVerificationCookie,
  generateDriverPassCode,
} from "../utils/server/auth-driver-passcode";

const authDriverHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    const { depotId, driverId, email, magicCode, pathId } = req.body;

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

    const expectedPasscode = generateDriverPassCode({
      pathId: pathId as string,
      depotCode: depot.magicCode,
      email: vehicle?.driver!.email,
    });

    const userPasscode = generateDriverPassCode({
      pathId: pathId as string,
      depotCode: magicCode as string,
      email: email as string,
    });

    if (expectedPasscode !== userPasscode)
      return res.status(400).send("Invalid magic code");

    const cookie = createDriverVerificationCookie({
      passcode: userPasscode,
      minuteDuration: 720,
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
