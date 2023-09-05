import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
export default authMiddleware({
  publicRoutes: ["/", "/tools", "/tools/(.*)", "/api/(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isPasswordEnabled = !!process.env.NEXT_PUBLIC_PASSWORD_PROTECT;
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/sign-up")) {
    const isLoggedIn = req.cookies.has("login");
    const isPathPasswordProtect =
      req.nextUrl.pathname.startsWith("/password-protect");
    if (isPasswordEnabled && !isLoggedIn && !isPathPasswordProtect) {
      return NextResponse.redirect(new URL("/password-protect", req.url));
    }
    return NextResponse.next();
  }

  return;
}
