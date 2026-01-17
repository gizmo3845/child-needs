import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_TOKEN = "authenticated";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(SESSION_COOKIE);

    if (session?.value !== SESSION_TOKEN) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/lists and /api/items routes (except GET for public list access)
  if (
    (pathname.startsWith("/api/lists") || pathname.startsWith("/api/items")) &&
    request.method !== "GET"
  ) {
    const session = request.cookies.get(SESSION_COOKIE);

    if (session?.value !== SESSION_TOKEN) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/lists/:path*", "/api/items/:path*"],
};
