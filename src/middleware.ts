import { authMiddleware } from "@clerk/nextjs";

import { NextResponse, type NextRequest } from "next/server";

const isPasswordEnabled = !!process.env.NEXT_PUBLIC_PASSWORD_PROTECT;

export default authMiddleware({
  beforeAuth: (req: NextRequest) => {
    if (
      req.nextUrl.pathname.startsWith("/sign-up") ||
      req.nextUrl.pathname.startsWith("/sign-in")
    ) {
      const isLoggedIn = req.cookies.has("login");
      const isPathPasswordProtect =
        req.nextUrl.pathname.startsWith("/password-protect");
      if (isPasswordEnabled && !isLoggedIn && !isPathPasswordProtect) {
        return NextResponse.redirect(new URL("/password-protect", req.url));
      }
      return NextResponse.next();
    }

    return;
  },

  publicRoutes: [
    "/",
    "/tools",
    "/tools/(.*)",
    "/api/(.*)",
    "/products",
    "/shops",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
