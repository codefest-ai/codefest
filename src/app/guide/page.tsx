import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: "Pre-Hackathon Playbook",
  description: "The week-by-week countdown to being ready when the clock starts. What to do T-7 days, T-3 days, T-1 day, and morning-of.",
  openGraph: {
    title: "Pre-Hackathon Playbook — Codefest.ai",
    description: "Don't waste the first hour. Here's how to show up ready.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Pre-Hackathon Playbook",
  "description": "How to prepare for a hackathon in the week before it starts",
  "url": "https://codefest.ai/guide",
  "publisher": { "@type": "Organization", "name": "Codefest.ai", "url": "https://codefest.ai" },
}

type CheckItem = { text: string; note?: string }
type Phase = { id: string; label: string; time: string; color: string; dot: string; items: CheckItem[] }

const PHASES: Phase[] = [
  {
    id:    "t7",
    label: "T-7 days",
    time:  "One week out",
    color: "border-purple-500/30 bg-purple-500/5",
    dot:   "bg-purple-500",
    items: [
      { text: "Read the problem statement or theme carefully", note: "Screenshot it. You'll forget details under pressure." },
      { text: "Identify which of the 6 core feature types fits your likely idea", note: "Map · Form · AI · Data · Realtime · Alerts" },
      { text: "Spin up a Next.js + Supabase project now", note: "Don't start from zero on the day. Auth alone takes 15 minutes when you're calm and 90 minutes when you're stressed." },
      { text: "Make sure Google OAuth works end-to-end in your test project", note: "" },
      { text: "Set up Vercel deployment — get one green deploy before the event", note: "" },
      { text: "Check what APIs/datasets are relevant to the theme", note: "Government data portals, health datasets, climate APIs. Knowing they exist is different from having access." },
      { text: "Form or confirm your team", note: "Ideally: one frontend/fullstack, one domain expert or PM, one person who can pitch" },
    ],
  },
  {
    id:    "t3",
    label: "T-3 days",
    time:  "Three days out",
    color: "border-blue-500/30 bg-blue-500/5",
    dot:   "bg-blue-500",
    items: [
      { text: "Run the Codefest workspace for your likely problem domain", note: "Get your recommended stack. Have the docs bookmarked." },
      { text: "Download or generate your AI context pack", note: "Load it into Claude or your AI editor now. Test that your AI gives hackathon-aware answers, not generic ones." },
      { text: "Install the Codefest MCP server in Claude Desktop or Cursor", note: "So you can query the component library from inside your editor." },
      { text: "Agree on your stack as a team — write it down", note: "No debates on the day. The default is: Next.js · Supabase · Tailwind · Vercel." },
      { text: "Identify the one external API or dataset your idea depends on", note: "Sign up for API keys now. Don't wait until 11pm Saturday." },
      { text: "Do a dry run: start from zero and get a page deployed in under 30 minutes", note: "This reveals setup friction while you still have time to fix it." },
    ],
  },
  {
    id:    "t1",
    label: "T-1 day",
    time:  "Day before",
    color: "border-brand-500/30 bg-brand-500/5",
    dot:   "bg-brand-500",
    items: [
      { text: "Sketch your 3-screen demo on paper", note: "What does a judge see in 3 minutes? Name those 3 screens." },
      { text: "Write your one-sentence problem statement", note: 'Format: "For [who], [X] is a problem because [Y]. We\'re building [Z] that does [specific thing]."' },
      { text: "Make sure your laptop is charged and charging cable is packed", note: "" },
      { text: "Set up hotspot on your phone as backup WiFi", note: "Hackathon WiFi is always bad. Always." },
      { text: "Clone your template project or create the repo", note: "Push a skeleton app. Wake up with something to deploy." },
      { text: "Sleep at least 7 hours", note: "This is not optional. Cognitive performance drops 25% on 6 hours. You will make worse decisions and write worse code." },
    ],
  },
  {
    id:    "day0",
    label: "Morning of",
    time:  "Day of the event",
    color: "border-accent-amber/30 bg-accent-amber/5",
    dot:   "bg-accent-amber",
    items: [
      { text: "Load your AI context pack first thing", note: "Before any code. Prime your AI for the next 24 hours." },
      { text: "Spend the first 30 minutes on alignment, not code", note: 'Agree on: the 3 demo screens, the one "wow moment", what you\'re cutting if time runs short.' },
      { text: "Set up in order: framework → database → auth → your feature", note: "Resist building features before the foundation works. Every time." },
      { text: "Deploy something (even a skeleton) within the first 2 hours", note: "An early deploy proves your pipeline works and gives you a URL to share." },
      { text: "Set a midpoint check at the halfway mark", note: "Are you on the demo path? Is anything blocking you? Cut or mock anything that isn't core." },
      { text: "Reserve the last 2 hours for demo prep and practice", note: "Not new features. A smooth 3-minute demo beats a rough 5-minute one every time." },
    ],
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-surface-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">

        {/* Header */}
        <div className="mb-14">
          <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400 mb-5 font-mono uppercase tracking-wider">
            Pre-Hackathon Playbook
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
            Show up ready.<br />
            <span className="text-zinc-500">Don&apos;t waste the first hour.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            The first hour of a hackathon is the most expensive. Teams that show up
            prepared — with a stack chosen, a project scaffolded, and a problem scoped —
            consistently outperform teams that start from zero.
          </p>
          <p className="text-zinc-500 text-sm mt-4">
            This is the week-by-week countdown. Work through it once before your next event.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-10">
          {PHASES.map((phase) => (
            <section key={phase.id} id={phase.id}>
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`h-3 w-3 rounded-full shrink-0 ${phase.dot}`} />
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{phase.label}</h2>
                  <p className="text-xs text-zinc-600">{phase.time}</p>
                </div>
              </div>

              {/* Checklist */}
              <div className={`rounded-2xl border ${phase.color} overflow-hidden`}>
                {phase.items.map((item, i) => (
                  <div
                    key={i}
                    className={`px-6 py-4 ${i !== 0 ? "border-t border-white/[0.04]" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-md border border-white/[0.12] bg-surface-2 shrink-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-sm bg-transparent" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-200 font-medium leading-snug">{item.text}</p>
                        {item.note && (
                          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Tools CTA */}
        <div className="mt-16 rounded-2xl border border-white/[0.06] bg-surface-1 p-8">
          <h2 className="text-lg font-bold text-white mb-2">Tools that do the prep work for you</h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Several of the checklist items above take 30 seconds with the right tool.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/workspace"
              className="rounded-xl border border-white/[0.08] bg-surface-2 p-4 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group"
            >
              <div className="text-xl mb-2">⚡</div>
              <p className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">Workspace</p>
              <p className="text-xs text-zinc-500 mt-1">Get your stack + export your AI context pack</p>
            </Link>
            <Link
              href="/library"
              className="rounded-xl border border-white/[0.08] bg-surface-2 p-4 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group"
            >
              <div className="text-xl mb-2">📦</div>
              <p className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">Component Library</p>
              <p className="text-xs text-zinc-500 mt-1">58 curated components with setup guides</p>
            </Link>
            <a
              href="https://github.com/codefestai/mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.08] bg-surface-2 p-4 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group"
            >
              <div className="text-xl mb-2">🔌</div>
              <p className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">MCP Server</p>
              <p className="text-xs text-zinc-500 mt-1">Component library inside Claude Desktop &amp; Cursor</p>
            </a>
          </div>
        </div>

        {/* Further reading */}
        <div className="mt-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-600 mb-4">Related reading</h2>
          <div className="space-y-2">
            {[
              { href: "/blog/stop-wasting-the-first-hour",     label: "Stop Wasting the First Hour" },
              { href: "/blog/build-for-the-demo",              label: "Build for the Demo, Not the Dream" },
              { href: "/blog/the-default-stack",               label: "The Default Stack for First-Time Teams" },
              { href: "/blog/auth-patterns-for-hackathons",    label: "Auth Patterns for Hackathons" },
              { href: "/blog/team-formation-mistakes",         label: "The 5 Team Formation Mistakes" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-lg border border-white/[0.04] px-4 py-3 text-sm text-zinc-400 hover:text-white hover:border-white/[0.10] transition-all group"
              >
                {label}
                <span className="text-zinc-700 group-hover:text-zinc-400 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
