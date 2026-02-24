import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About — Codefest.ai",
  description:
    "Codefest.ai exists because the hackathon ecosystem never built infrastructure for the person at the laptop at 2am. We're fixing that — and refusing to become everything else.",
  openGraph: {
    title: "What Codefest.ai is and refuses to be",
    description:
      "Built by a hackathon participant who got tired of wasting the first hour. Here's the belief system behind the platform.",
  },
}

const BELIEFS = [
  {
    n: "01",
    h: "The hackathon is a crucible, not a competition.",
    b: "The point was never the prize. It was what happened to you inside 48 hours of real-stakes building — the discovery, the collaboration, the 2am moment when something finally works. The prize was just proof that it happened. We build everything around that experience, not around the leaderboard.",
  },
  {
    n: "02",
    h: "The research phase was never the pedagogy.",
    b: "Nobody became a better engineer by independently discovering which npm package handles authentication. That friction was overhead. It was never teaching anything. The learning was always in the building, the scoping, the teamwork, the problem — and those things will always be entirely beyond our reach, by design.",
  },
  {
    n: "03",
    h: "Curation is a craft. Linking is not hosting.",
    b: "Every component in our library is a link to a public GitHub repo. We don't redistribute code. We don't build anything for participants. We add the context that Google search can't: setup times vetted against real hackathon conditions, difficulty ratings that account for team size and time pressure, compatibility notes from projects that actually shipped.",
  },
  {
    n: "04",
    h: "The execution gap is closing. What's left is the real thing.",
    b: "AI is flattening the barrier to building. A team with no prior experience can ship something genuinely impressive in 24 hours now. That changes what hackathons are actually testing — and it means the differentiator is moving up the stack, toward problem selection, domain understanding, creative synthesis. That's where it should have always been. We're positioned at that inflection point.",
  },
  {
    n: "05",
    h: "Projects should outlive demo day.",
    b: "Only about 7% of hackathon projects show any activity six months after the event. That's a structural failure, not a talent failure. The teams did the work. The ideas were real. The ecosystem just never built a way to preserve them, fork them, or learn from them. We're building that layer — so the work compounds instead of disappearing.",
  },
  {
    n: "06",
    h: "We build with organizers, not at them.",
    b: "Faculty run hackathons because they believe something transformative happens in that room. We believe that too. Our job is to protect it — by removing the friction that was never part of the design, not by redefining the experience. If we ever become something that makes organizers uncomfortable, we want to hear why. We'd probably agree.",
  },
]

const REFUSING = [
  "Sponsored component placements — curation based on who paid us, not what works",
  "Code generation — we link to tools, we don't build for participants",
  "Gamification that optimizes for engagement over outcomes",
  "Organizer lock-in — we want participants to come back because it helped, not because they have to",
  "Keeping projects siloed — the Preservation Layer is coming because knowledge should compound",
  "Becoming an event management platform — registration, judging pipelines, and organizer tooling are a different problem",
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface-0 text-white">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.05]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[160px] bg-brand-500/8 blur-[80px] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/[0.06] px-3 py-1 mb-6">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-400">
              About Codefest.ai
            </span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.06] tracking-[-0.03em] max-w-2xl mb-6">
            Built for the person at the laptop{" "}
            <span className="text-brand-400">at 2am.</span>
          </h1>

          <div className="max-w-2xl space-y-4 text-zinc-400 text-base leading-relaxed">
            <p>
              When the clock starts, every team faces the same first hour:
              which database, which auth library, which deployment target.
              That friction isn&rsquo;t teaching anything — the learning is in the
              building, the scoping, the problem itself.
            </p>
            <p>
              Codefest.ai is built to remove that overhead for everyone — not
              to give any one team an advantage over another, but to lower the
              barriers that get in the way of building great things. Technical
              or non-technical, first-time or veteran: the goal is to get every
              team in front of what they need as fast as possible, so they can
              start doing the actual work.
            </p>
            <p>
              It grew out of direct experience with that first hour — and a
              belief that the hackathon should be about what you build,
              not how long it takes to find the right tool.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE BELIEVE ──────────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              what we believe
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              The belief system behind every decision we make.
            </h2>
          </div>

          <div className="space-y-0 divide-y divide-white/[0.04]">
            {BELIEFS.map((b) => (
              <div key={b.n} className="py-8 grid md:grid-cols-[2rem_1fr] gap-6">
                <div className="font-mono text-[10px] text-brand-500 pt-0.5 shrink-0">
                  {b.n}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-2 leading-snug">
                    {b.h}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{b.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE REFUSE TO BECOME ─────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              what we refuse to become
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Constraints are commitments.
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-lg">
              These aren&rsquo;t disclaimers. They&rsquo;re decisions. The things we won&rsquo;t
              build are as important as the things we will.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-surface-1 divide-y divide-white/[0.04] overflow-hidden">
            {REFUSING.map((r) => (
              <div key={r} className="flex items-start gap-4 px-6 py-4">
                <span className="text-zinc-700 shrink-0 font-mono text-sm mt-0.5">—</span>
                <span className="text-sm text-zinc-400 leading-relaxed">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE BIGGER PICTURE ───────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              where this is going
            </div>
            <h2 className="text-xl font-semibold tracking-tight max-w-xl">
              The hackathon is becoming the fastest way to prove you can build something real.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                Esports created speedrunning infrastructure — leaderboards, replay
                systems, community-vetted routes, shared techniques — that made
                competition something you could study, improve at, and build a
                community around. Hackathons have nothing equivalent. Every team
                starts from scratch. Every winning stack disappears after demo day.
                Every cohort reinvents the same solutions.
              </p>
              <p>
                That&rsquo;s the gap Codefest is closing. Not just the first hour —
                but the entire infrastructure layer that was always missing: the
                preserved knowledge, the curated patterns, the institutional memory
                that makes each hackathon build on the last one rather than
                starting over.
              </p>
            </div>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                AI is accelerating this. When the execution barrier flattens, the
                differentiator becomes the quality of the question you&rsquo;re
                asking. The problem statement. The domain understanding. The
                creative synthesis that no tool can generate for you.
              </p>
              <p>
                Codefest is positioned exactly at that inflection point: handling
                the infrastructure so participants can focus on the part that
                matters — and building the preservation layer so the work that
                gets done in those 48 hours doesn&rsquo;t vanish on Monday morning.
              </p>
              <p className="text-zinc-300">
                One day truly innovate. Build something that matters.
                Come out different on the other side.
                That&rsquo;s what this is for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LINKS OUT ────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                label: "For participants",
                desc: "Open the workspace and start your session.",
                href: "/workspace",
                cta: "Open workspace",
              },
              {
                label: "For organizers",
                desc: "How Codefest protects the experience you're building.",
                href: "/organizers",
                cta: "Read the case",
              },
              {
                label: "The full argument",
                desc: "Why the research phase was never the pedagogy.",
                href: "/blog/why-organizers-endorse-codefest",
                cta: "Read the post",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group rounded-xl border border-white/[0.06] bg-surface-1 p-5 transition-all hover:border-white/[0.12] hover:bg-surface-2 block"
              >
                <div className="font-mono text-[10px] text-brand-500 mb-2 uppercase tracking-wider">
                  {l.label}
                </div>
                <div className="text-sm text-zinc-400 leading-relaxed mb-4">{l.desc}</div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  {l.cta}
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
