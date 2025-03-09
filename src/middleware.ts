import { type NextRequest, NextResponse } from "next/server";

import getOrganizationListInMiddleware from "./actions/getOrganizationListInMiddleware";
import { auth } from "./auth";

// Define protected routes in a Set for O(1) lookups
const PROTECTED_ROUTES = new Set([
  "/dashboard",
  "/members",
  "/projects",
  "/settings",
]);

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  if (process.env.NODE_ENV === "development") {
    console.log("Middleware Executed");
  }

  // Check if the current path is a protected route
  const isProtectedRoute = Array.from(PROTECTED_ROUTES).some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decision = await getOrganizationListInMiddleware(
      session?.user.id || ""
    );

    if (!decision) {
      return NextResponse.redirect(new URL("/new-organization", request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
