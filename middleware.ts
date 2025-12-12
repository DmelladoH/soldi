import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Auth route matcher for Clerk
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Your combined middleware
const customMiddleware = clerkMiddleware(async (auth, req) => {
  // Protect dashboard routes with Clerk
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Report redirect logic for /dashboard/reports
  const { pathname } = req.nextUrl;

  if (pathname === "/dashboard/reports" || pathname === "/dashboard/reports/") {
    const currentYear = new Date().getFullYear();
    const lastMonth = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(new Date().setMonth(new Date().getMonth() - 1));

    const redirectUrl = new URL(
      `/dashboard/reports/${currentYear}/${lastMonth}`,
      req.url
    );

    return NextResponse.redirect(redirectUrl);
  }

  // Let everything else through
  return NextResponse.next();
});

export default customMiddleware;

// Matcher config
export const config = {
  matcher: [
    // Apply to all routes excluding static files and internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Include API routes too
    "/(api|trpc)(.*)",
  ],
};
