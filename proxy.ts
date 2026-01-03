import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session_user");
  const path = request.nextUrl.pathname;

  const isAdminPage = path.startsWith("/admin");
  const isAuthPage =
    path.startsWith("/auth/login") || path.startsWith("/auth/register");

  // --- ADMIN PROTECTION ---
  if (isAdminPage) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const user = JSON.parse(session.value);
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // --- BLOCK AUTH PAGE IF LOGGED ---
  if (session && isAuthPage) {
    const user = JSON.parse(session.value);

    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// NEW MATCHER – proxy.ts
export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
``