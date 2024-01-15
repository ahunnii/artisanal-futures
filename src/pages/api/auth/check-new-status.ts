import type { NextApiRequest, NextApiResponse } from "next";
const inviteHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const isValid = req.headers.cookie?.includes("login");

    res.status(200).json(isValid);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default inviteHandler;
