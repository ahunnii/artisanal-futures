// import { authMiddleware } from "@clerk/nextjs";

// import { NextResponse, type NextRequest } from "next/server";

// const isPasswordEnabled = !!process.env.NEXT_PUBLIC_PASSWORD_PROTECT;

// export default authMiddleware({
//   beforeAuth: (req: NextRequest) => {
//     if (
//       req.nextUrl.pathname.startsWith("/sign-up") ||
//       req.nextUrl.pathname.startsWith("/sign-in")
//     ) {
//       const isLoggedIn = req.cookies.has("login");
//       const isPathPasswordProtect =
//         req.nextUrl.pathname.startsWith("/password-protect");
//       if (isPasswordEnabled && !isLoggedIn && !isPathPasswordProtect) {
//         return NextResponse.redirect(new URL("/password-protect", req.url));
//       }
//       return NextResponse.next();
//     }

//     return;
//   },

//   publicRoutes: [
//     "/",
//     "/tools",
//     "/tools/(.*)",
//     "/api/(.*)",
//     "/products",
//     "/shops",
//   ],
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
// export { default } from "next-auth/middleware";

// export const config = { matcher: ["/profile/:path*"] };
// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth((req) => {
//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     if (req..userRole !== "Admin") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//   }
//   if (req.nextUrl.pathname.startsWith("/premium")) {
//     if (req.nextauth.token.userRole !== "Premium") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//   }
// });

// export const config = {
//   matcher: ["/admin/:path*", "/premium/:path*"],
// };
