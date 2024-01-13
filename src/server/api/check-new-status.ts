import { NextApiRequest, NextApiResponse } from "next";

const inviteHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const isValid = req.cookies.login;

    if (!isValid) res.status(400);

    res.status(200);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default inviteHandler;
