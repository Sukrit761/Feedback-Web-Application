import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const pathname = req.nextUrl.pathname;

  // Redirect logged-in users away from auth pages
  if (token && ["/sign-in", "/sign-up", "/verify"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard from non-authenticated users
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth).*)", // 🚀 Completely exclude NextAuth API
    "/sign-in",
    "/sign-up",
    "/verify",
    "/dashboard/:path*",
  ],
};
