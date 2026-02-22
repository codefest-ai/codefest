import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ── Maintenance mode ──────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_MAINTENANCE=true in Vercel environment variables to enable.
// When enabled, all routes redirect to /maintenance except the page itself,
// static assets, and Next.js internals.
// To disable: remove the env var or set it to false and redeploy.
// ─────────────────────────────────────────────────────────────────────────────

const MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE === "true"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (MAINTENANCE) {
    // Allow the maintenance page itself, static assets, and Next.js internals
    const allowed =
      pathname === "/maintenance" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/og") ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml"

    if (!allowed) {
      const url = request.nextUrl.clone()
      url.pathname = "/maintenance"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
}
