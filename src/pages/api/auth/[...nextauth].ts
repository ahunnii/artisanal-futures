// import NextAuth from "next-auth";

// import { authOptions } from "~/server/auth";

// export default NextAuth(authOptions);

import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { authWithContext } from "~/server/auth";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authWithContext({ res, req }));
}
