import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { CheckCircle, ArrowRight, BookOpen, Users, Target, BarChart2, Zap, Mail } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "For Organizers & Faculty — Codefest.ai",
  description:
    "The hackathon is a crucible. The learning, the camaraderie, the discovery of what's possible — that's what you're protecting. Codefest removes the friction that was never part of the design.",
  openGraph: {
    title: "Why Faculty Endorse Codefest.ai",
    description:
      "You run hackathons because of what happens when people build under pressure. Codefest removes the parts that got in the way of that — and never touched the parts that matter.",
  },
}

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
    desc: "Guided wizard that helps formulate prompts aligned with your sponsors, institution, and participant skill level. No more 'a cool problem for hackers' email to sponsors.",
  },
  {
    icon: Users,
    title: "Participant Pre-Brief Generator",
    desc: "Auto-generates a pre-event guide for your participants based on your challenge domain. One link replaces the workshop you don't have time to run.",
  },
  {
    icon: BarChart2,
    title: "School Profile & Institutional Context",
    desc: "Embed your school's research priorities, SDG commitments, and faculty expertise. AI-assisted prompt generation specific to your institution.",
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
            You run hackathons because of what happens when people{" "}
            <span className="text-brand-400">build under pressure.</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-8">
            The learning. The camaraderie. The 2am moment when something finally works.
            The student who walks out different on Sunday than they were on Friday.
            That&rsquo;s what you&rsquo;re protecting. Codefest removes the friction that
            was never part of that design — so more of your event is the part that matters.
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

      {/* ── THE REAL VALUE ───────────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              00 · what you&rsquo;re actually building
            </div>
            <h2 className="text-xl font-semibold tracking-tight max-w-xl">
              The hackathon is the closest thing education has to a real crucible.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left — the real values */}
            <div className="space-y-5">
              {[
                {
                  e: "🔥",
                  h: "Discovery under pressure",
                  d: "Students find out what they're actually capable of. Not in a controlled lab setting — in a messy, time-constrained, real-stakes environment. That's the point.",
                },
                {
                  e: "🤝",
                  h: "Camaraderie and collaboration",
                  d: "The team that barely knows each other Friday morning is finishing each other's sentences Sunday night. That relationship, and what creates it, doesn't happen in a classroom.",
                },
                {
                  e: "💡",
                  h: "Synectic thinking — combining unlike things",
                  d: "Hackathons force unlikely combinations: the designer and the ML engineer, the public health student and the backend developer. The creative leap that happens at that intersection is irreplaceable.",
                },
                {
                  e: "⚡",
                  h: "Everyone in the same boat",
                  d: "The shared constraint is the magic. Same clock. Same pressure. Same Friday-morning uncertainty. That shared experience is what bonds participants and makes the weekend memorable.",
                },
                {
                  e: "🌍",
                  h: "Changing the world was never more possible",
                  d: "AI has flattened the execution barrier. A team with no prior experience can build something genuinely impressive in 24 hours now. The question isn't can you build — it's what will you build, and why.",
                },
              ].map((v) => (
                <div key={v.h} className="flex gap-4">
                  <span className="text-xl shrink-0 mt-0.5">{v.e}</span>
                  <div>
                    <div className="text-sm font-semibold text-zinc-200 mb-1">{v.h}</div>
                    <div className="text-xs text-zinc-500 leading-relaxed">{v.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — the argument */}
            <div className="space-y-4">
              <div className="rounded-xl border border-brand-500/15 bg-brand-500/[0.04] p-6">
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  None of those things — not one — depend on whether your students
                  independently discovered which authentication library to use.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  Nobody has ever said &ldquo;that hackathon changed me — I&rsquo;ll never forget
                  the three hours I spent figuring out which database to use.&rdquo; That friction
                  was always overhead. It was never pedagogy.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  The question of whether Codefest is &ldquo;appropriate for an academic
                  setting&rdquo; is a category error. It&rsquo;s asking whether
                  it&rsquo;s okay to remove something that was never teaching
                  anything in the first place.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-surface-1 p-6">
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-zinc-500 mb-3">
                  especially in an AI hackathon
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  When AI compresses execution, the differentiator between teams
                  becomes almost entirely creative: problem selection, domain
                  understanding, the quality of the question being asked.
                  Codefest compresses the irrelevant part. It doesn&rsquo;t touch
                  the part that matters — and it never could.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIX FRICTION POINTS ─────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              01 · friction we remove
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Six things that get in the way of what you&rsquo;re trying to create
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-xl">
              None of these are learning. All of them eat your participants&rsquo; most
              valuable hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: "⏱️",
                problem: "The first 2 hours disappear into setup",
                solution:
                  "Every tool in our library has a setup time estimate and difficulty rating. Teams know what they're committing to before they start — and can get moving faster.",
              },
              {
                icon: "📚",
                problem: "Mentors spend the morning on logistics, not problems",
                solution:
                  "A curated resource layer absorbs the 'which auth library' and 'how does Stripe work' questions — before they reach your mentors and eat the time meant for real guidance.",
              },
              {
                icon: "🎯",
                problem: "Teams overscope and collapse on Saturday night",
                solution:
                  "Our workspace helps teams define the problem, domain, and stack before they write a line. Structured starts lead to scoped builds that actually ship.",
              },
              {
                icon: "📉",
                problem: "20% of teams abandon before demo day",
                solution:
                  "The teams that fall behind early rarely catch up. Teams that start clean have more time to iterate — and teams that iterate don't quit.",
              },
              {
                icon: "🌍",
                problem: "SDG-themed submissions that miss the theme",
                solution:
                  "Our challenge domains map directly to the UN SDG framework. Participants see how their stack and their problem connect to the goal you set.",
              },
              {
                icon: "🔒",
                problem: "Concern about AI doing the work for students",
                solution:
                  "We link to public repos and docs. Nothing that isn't one Google search away. This is a structured bibliography — and the research was never the point anyway.",
              },
            ].map((p) => (
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

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-surface-1 p-6">
            <p className="text-zinc-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">The standard:</span>{" "}
              You allow participants to use Google. You allow them to read documentation.
              You allow Stack Overflow. Codefest is a structured, curated version of all
              three — organized for hackathon conditions, no sponsored placements, no code
              generation. If you allow the internet, you allow Codefest. And more
              importantly: the hard parts — the creativity, the collaboration, the
              problem-solving under pressure — those are entirely up to your students.
              We don&rsquo;t touch them. We never could.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW TO USE IT ─────────────────────────────────────────── */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              03 · how to deploy it
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
                desc: "Put codefest.ai/workspace in your opening slide. Tell participants: before you write a line of code, spend 10 minutes here. That's it. They arrive at the hard part faster.",
              },
              {
                step: "02",
                title: "Send the pre-event brief",
                desc: "Link participants to codefest.ai/guide one week out. It's a week-by-week countdown with preparation checklists. Zero effort from you. Real reduction in first-morning chaos.",
              },
              {
                step: "03",
                title: "Share the library by domain",
                desc: "Health equity challenge? Send codefest.ai/library filtered by Health. Fewer 'what should we use?' questions reaching mentors. More time on the actual problem.",
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
              Tools we&rsquo;re building for you specifically
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
              let&rsquo;s talk
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Running a hackathon this semester?
            </h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              We&rsquo;d like to understand how your event runs. Tell us about your challenge
              domain, participant cohort, and what you want students to walk away with —
              and we&rsquo;ll show you exactly how to use Codefest to protect that.
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
