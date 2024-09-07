import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE_KEY } from "./lib/constants";

// 1. Specify protected and public routes
const publicRoutes = ["/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = cookies().get(AUTH_TOKEN_COOKIE_KEY)?.value;

  // If no cookie, check if it's a public route and continue or redirect to signup
  if (!cookie) {
    if (isPublicRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/signup", req.nextUrl));
  }

  // If has cookies and is in signup page, redirect to home
  if (path === "/signup") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
