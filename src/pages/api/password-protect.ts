import { serialize } from "cookie";

import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
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
    res.redirect(302, "/sign-in");
  } else {
    const url = new URL("/password-protect", req.headers.origin);
    url.searchParams.append("error", "Incorrect Password");
    res.redirect(url.toString());
  }
}
