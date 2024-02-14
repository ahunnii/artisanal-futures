import type { NextApiRequest, NextApiResponse } from "next";

import updateUserLocationHandler from "~/apps/solidarity-routing/api/update-user-location";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await updateUserLocationHandler(req, res);
};

export default handler;
