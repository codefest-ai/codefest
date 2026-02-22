import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "@/components/AuthProvider"
import "./globals.css"

const SITE_URL = "https://codefest.ai"
const SITE_NAME = "Codefest.ai"
const TAGLINE = "Stop wasting the first hour."
const DESCRIPTION = "The hackathon operating system. Curated components, winning patterns, team tools, and project planning — everything you need when the clock starts."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: ["hackathon", "hackathon tools", "component library", "hackathon OS", "team formation", "project planning", "SDG", "codefest"],
  authors: [{ name: "Evren Arat", url: "https://codefest.ai" }],
  creator: "Codefest.ai",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: [{ url: "/og", width: 1200, height: 630, alt: "Codefest.ai — The Hackathon Operating System" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: ["/og"],
    creator: "@codefestai",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
