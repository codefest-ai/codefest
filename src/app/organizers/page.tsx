import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { CheckCircle, ArrowRight, BookOpen, Users, Target, BarChart2, Zap, Mail } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "For Organizers & Faculty — Codefest.ai",
  description:
    "Make Codefest.ai the launch page of your hackathon. Better participant starts, higher-quality projects, happier sponsors. Free, SDG-aligned, no code generation.",
  openGraph: {
    title: "Why Faculty Endorse Codefest.ai",
    description:
      "Your students are googling these tools anyway. Codefest gives them a curated, vetted starting point — and saves your mentors the first two hours of setup questions.",
  },
}

const PAIN_POINTS = [
  {
    icon: "⏱️",
    problem: "Students waste the first 2 hours on setup",
    solution:
      "Every component has a setup time estimate and difficulty rating. Students know what they're getting into before they commit.",
  },
  {
    icon: "📚",
    problem: "Mentors answer the same questions all weekend",
    solution:
      "A curated resource layer absorbs the 'which auth library' and 'how does Stripe work' questions before they reach your mentors.",
  },
  {
    icon: "🎯",
    problem: "Challenge prompts don't align with participant skill",
    solution:
      "Our library is organized by domain and difficulty. Participants self-select the right complexity level for their team.",
  },
  {
    icon: "📉",
    problem: "Projects are abandoned before demo day",
    solution:
      "Teams that start with a validated stack ship faster and iterate more. Lower abandonment. Better demos. Happier sponsors.",
  },
  {
    icon: "🌍",
    problem: "Hard to align submissions with SDG themes",
    solution:
      "Our challenge domains map directly to the UN SDG framework. Participants see how their stack fits the social impact goal.",
  },
  {
    icon: "🔒",
    problem: "Worried about AI doing the work for students",
    solution:
      "We link to public repos and docs — nothing that isn't already one Google search away. We are a structured bibliography, not a code generator.",
  },
]

const WHAT_WE_ARE_NOT = [
  "We do not generate code",
  "We do not write architecture decisions",
  "We do not solve the challenge prompt",
  "We do not have sponsored placements",
  "We do not require login to browse",
  "We do not host or redistribute any code",
]

const WHAT_WE_ARE = [
  "A curated link library — like a bibliography for dev tools",
  "Setup time estimates vetted against real hackathon conditions",
  "Difficulty ratings so teams self-select the right complexity",
  "SDG-aligned challenge domains matching institutional goals",
  "Winning patterns from real hackathons — stacks, not solutions",
  "A workspace to define problem, domain, and stack before hour one",
]

const COMING_FOR_ORGANIZERS = [
  {
    icon: Target,
    title: "Challenge Prompt Builder",
    desc: "Wizard that helps formulate prompts aligned with your sponsors, institution, and participant skill level. No more 'a cool problem for hackers' email to sponsors.",
  },
  {
    icon: Users,
    title: "Participant Pre-Brief Generator",
    desc: "Auto-generates a pre-event guide for your participants based on your challenge domain. One link replaces the workshop you don't have time to run.",
  },
  {
    icon: BarChart2,
    title: "School Profile & Institutional Context",
    desc: "Embed your school's research priorities, SDG commitments, and faculty expertise. AI-assisted prompt generation that's specific to your institution.",
  },
  {
    icon: BookOpen,
    title: "Sponsor Alignment Cards",
    desc: "Know what sponsors actually want before you design the challenge. Capture constraints, red flags, and success criteria — so your prompt serves everyone.",
  },
]

export default function OrganizersPage() {
  return (
    <div className="min-h-screen bg-surface-0 text-white">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.05]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-brand-500/8 blur-[80px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/[0.06] px-3 py-1 mb-6">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-400">
              For Organizers & Faculty
            </span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.8rem)] font-bold leading-[1.06] tracking-[-0.03em] max-w-3xl mb-5">
            Make Codefest the{" "}
            <span className="text-brand-400">first tab</span>{" "}
            your students open.
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
            Your participants are going to Google these tools anyway. The question is whether
            they find a 2019 Stack Overflow thread — or a curated, vetted, hackathon-tested
            resource with setup times, difficulty ratings, and SDG-aligned challenge domains.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="mailto:hello@codefest.ai"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-brand-400"
            >
              <Mail className="h-4 w-4" />
              Get in touch
            </a>
            <Link
              href="/blog/why-organizers-endorse-codefest"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Read our case for faculty
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SIX PAIN POINTS ─────────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              01 · problems we solve for you
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Six things that make hackathons fail — and what we do about them
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.problem}
                className="rounded-xl border border-white/[0.06] bg-surface-1 p-5"
              >
                <div className="text-xl mb-3">{p.icon}</div>
                <div className="text-sm font-semibold text-zinc-300 mb-2 leading-snug">
                  {p.problem}
                </div>
                <div className="text-xs text-zinc-500 leading-relaxed">{p.solution}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE ARE / AREN'T ─────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              02 · transparency
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Exactly what we are. Exactly what we are not.
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-lg">
              Faculty deserve a direct answer. Here it is.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* What we ARE */}
            <div className="rounded-xl border border-brand-500/15 bg-brand-500/[0.03] p-6">
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-5">
                ✓ What Codefest is
              </div>
              <ul className="space-y-3">
                {WHAT_WE_ARE.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What we ARE NOT */}
            <div className="rounded-xl border border-white/[0.06] bg-surface-1 p-6">
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-zinc-600 mb-5">
                ✗ What Codefest is not
              </div>
              <ul className="space-y-3">
                {WHAT_WE_ARE_NOT.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-zinc-700 mt-0.5 shrink-0">—</span>
                    <span className="text-sm text-zinc-500 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The key argument */}
          <div className="mt-6 rounded-xl border border-white/[0.06] bg-surface-1 p-6">
            <p className="text-zinc-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">The standard:</span>{" "}
              You allow participants to use Google. You allow them to read documentation.
              You allow them to use Stack Overflow. Codefest is a structured, curated version
              of all three — organized specifically for hackathon conditions, with no sponsored
              placements and no code generation. If you allow the internet, you allow Codefest.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW TO USE IT ─────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              03 · how to use it
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Three ways to use Codefest at your event
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Set it as the start URL",
                desc: "Put codefest.ai/workspace in your opening slide or event welcome doc. Tell participants: before you write a line of code, spend 10 minutes here. That's it.",
              },
              {
                step: "02",
                title: "Send the pre-event brief",
                desc: "Link participants to codefest.ai/guide one week before the event. It's a week-by-week countdown with preparation checklists — zero effort from you, real reduction in participant anxiety.",
              },
              {
                step: "03",
                title: "Share the library by domain",
                desc: "If your challenge is health equity, send codefest.ai/library and suggest participants filter by Health. Saves the first round of mentor questions before they start.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-white/[0.06] bg-surface-1 p-5"
              >
                <div className="font-mono text-[10px] text-brand-500 mb-3">{s.step}</div>
                <div className="text-sm font-semibold text-zinc-200 mb-2">{s.title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMING FOR ORGANIZERS ─────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              04 · coming soon
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Tools we're building for you specifically
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-lg">
              The participant layer is live. The organizer layer is in development.
              If you want early access, tell us about your event.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {COMING_FOR_ORGANIZERS.map((t) => {
              const Icon = t.icon
              return (
                <div
                  key={t.title}
                  className="rounded-xl border border-white/[0.06] bg-surface-1 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-brand-500/10 border border-brand-500/15 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-brand-400" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-200">{t.title}</span>
                    <span className="ml-auto font-mono text-[9px] text-zinc-600 bg-white/[0.04] rounded px-1.5 py-0.5 shrink-0">
                      coming
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{t.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-brand-500/15 bg-brand-500/[0.04] px-8 py-12 text-center">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-brand-500 mb-4">
              let's talk
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Running a hackathon this semester?
            </h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              We'd like to understand how your event runs. Tell us about your challenge domain,
              participant cohort, and sponsor setup — and we'll show you exactly how to use
              Codefest to improve outcomes for everyone.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="mailto:hello@codefest.ai"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-400"
              >
                <Mail className="h-4 w-4" />
                hello@codefest.ai
              </a>
              <Link
                href="/blog/why-organizers-endorse-codefest"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
              >
                Read the full case
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
