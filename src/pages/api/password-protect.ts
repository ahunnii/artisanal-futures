import { serialize } from "cookie";

import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }
  const password = req.body.password;
  if (process.env.NEXT_PUBLIC_PASSWORD_PROTECT === password) {
    const oneMinute = 60 * 1000;

    const cookie = serialize("login", "true", {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + oneMinute),
    });
    res.setHeader("Set-Cookie", cookie);
    res.redirect(302, "/");
  } else {
    const url = new URL("/password-protect", req.headers.origin);
    url.searchParams.append("error", "Incorrect Password");
    res.redirect(url.toString());
  }
}
