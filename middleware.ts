import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register", "/api/docs", "/api/swagger"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow api-docs page
  if (pathname.startsWith("/api-docs")) {
    return NextResponse.next();
  }

  // Check for JWT token in cookies
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // API routes return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Frontend pages redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify token
  const user = verifyToken(token);
  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (user.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};