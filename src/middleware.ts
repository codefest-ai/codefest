import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// ── Maintenance mode ──────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_MAINTENANCE=true in Vercel environment variables to block
// all public traffic. Redirects everything to /maintenance except static
// assets and Next.js internals.
// ─────────────────────────────────────────────────────────────────────────────

const MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE === "true"

const MAINTENANCE_ALLOWED = [
  "/maintenance",
  "/_next",
  "/favicon",
  "/og",
  "/robots.txt",
  "/sitemap.xml",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (MAINTENANCE) {
    const allowed = MAINTENANCE_ALLOWED.some((p) => pathname.startsWith(p))
    if (!allowed) {
      const url = request.nextUrl.clone()
      url.pathname = "/maintenance"
      return NextResponse.redirect(url)
    }
  }

  // Refresh the Supabase session for server components / route handlers
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
