import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Stack Analyzer — Codefest.ai",
  description:
    "Paste a GitHub repo or DevPost project URL. We scan the dependencies and README, match everything to the Codefest library, and show you exactly what they built with.",
  openGraph: {
    title: "See any hackathon project's stack in seconds",
    description:
      "Drop a GitHub or DevPost link — Codefest maps the tech back to its curated library entries, with setup times and difficulty ratings.",
  },
}

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
