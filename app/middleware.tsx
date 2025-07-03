import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect only if the path is exactly "/dashboard/reports" or "/dashboard/reports/"
  if (pathname === "/dashboard/reports" || pathname === "/dashboard/reports/") {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(new Date());

    return NextResponse.redirect(
      new URL(`/dashboard/reports/${currentYear}/${currentMonth}`, request.url)
    );
  }

  // Allow all other requests to proceed normally
  return NextResponse.next();
}

// Match all paths under /dashboard/reports so the middleware triggers,
// but internal logic will decide if redirect is needed
export const config = {
  matcher: "/dashboard/reports/:path*",
};
