import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "HalalJobs.ai — Find work that aligns with your values",
    template: "%s | HalalJobs.ai",
  },
  description:
    "See the job market through your values. Every employer screened using AAOIFI-aligned criteria. Filter by what matters to you — we show the facts, you decide.",
  keywords: ["halal jobs", "muslim jobs", "islamic finance jobs", "halal career", "muslim career", "shariah compliant jobs", "AAOIFI screening"],
  openGraph: {
    title: "HalalJobs.ai — See the job market through your values",
    description:
      "Every employer screened using AAOIFI-aligned criteria. Filter by what matters to you.",
    url: "https://halaljobs.ai",
    siteName: "HalalJobs.ai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HalalJobs.ai",
    description: "See the job market through your values. AAOIFI-aligned employer screening.",
  },
  metadataBase: new URL("https://halaljobs.ai"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
