import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");

  // Skip auth check for login page and public app pages
  if (
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname.startsWith("/app/")
  ) {
    return NextResponse.next();
  }

  // Root path redirects to admin if authenticated, login if not
  // if (request.nextUrl.pathname === "/admin/login") {
  //   if (token) {
  //     return NextResponse.redirect(new URL("/admin/analytics", request.url));
  //   }
  //   return NextResponse.redirect(new URL("/admin/login", request.url));
  // }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

// Update matcher to include root path and all admin routes
export const config = {
  matcher: ["/", "/admin/:path*"],
};
