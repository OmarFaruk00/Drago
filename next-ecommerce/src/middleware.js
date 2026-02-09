import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("adminToken")?.value;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (token) return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.next();
    }
    if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
