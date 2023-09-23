import { serialize } from "cookie";

import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }
  const password = req.body.password;

  if (process.env.NEXT_PUBLIC_PASSWORD_PROTECT === password) {
    const fiveMinutes = 60 * 5000;

    const cookie = serialize("login", "true", {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + fiveMinutes),
    });
    res.setHeader("Set-Cookie", cookie);
    // res.redirect(302, "/sign-in");

    res.status(302).json({ success: true });
  } else {
    res.status(400).json({ success: false, error: "Incorrect Password" });
  }
}
