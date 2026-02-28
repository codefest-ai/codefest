# COWORK_MEMORY.md
## Persistent Memory File for Cowork Sessions
## Web Dev — Codefest.ai / HalalJobs.ai

---

## PURPOSE

Read FIRST before any task. Update LAST after every session. Never delete entries — only append.

---

## PROJECT CONTEXT

**What this workspace covers:** Web development projects. Currently two:

### Codefest.ai
- Hackathon coordination platform
- Monetization: free browsing, $1+ pay-what-you-can workspace, premium AI collaborative environment
- Deployed to Vercel
- Positioned as "first mass-market fig" that could pipeline users to Throughline
- Research brief completed with academic literature on hackathon success patterns

### HalalJobs.ai
- AI-powered job platform for Muslims to find values-aligned employment
- Domain purchased: halaljobs.ai
- Architecture: madhhab-specific filtering across 4 Sunni schools, AI halal compliance scoring, scholar consultation, community verification
- Three user types: job seekers, community donors (sadaqah credits), employers
- Reddit scraping discovery: someone scraped 4.1M jobs using ChatGPT for parsing — validates technical approach, shortcut to data pipeline
- Five comprehensive artifacts produced (master blueprint, smart prompt, tech spec, research, action plan)
- Status: architecture done, needs build

**Shared patterns:** Both projects use design patterns and deployment knowledge from each other. Reuse is intentional.

---

## ACTIVE PRIORITIES

- **Codefest:** Closest to $1. ~7 hours of work to first possible revenue. Single next task: pay-what-you-can modal on Export .md button.
- **HalalJobs:** ~14 hours to usable MVP. No payment path yet. Lower priority than Codefest for revenue, higher for mission.

## CODEFEST — CURRENT STATE (updated Feb 27, 2026)

- Live at codefest.ai — fully functional, no blockers
- Analytics: 21 visitors, 236 page views, 6 workspace sessions, 67% bounce rate
- Referrers: Teams (user-shared), vercel.com, websitelaunches.com
- No payment infrastructure — zero Stripe/LemonSqueezy installed
- Mobile workspace fixed (responsive two-panel → single column on mobile, committed f0cbaba)
- Vercel project lives under codefest-ai GitHub org (not resourcestory@gmail.com account)
- Design direction: dark aesthetic correct for audience, light landing page variant worth prototyping

## HALALJOBS — CURRENT STATE (updated Feb 27, 2026)

- Status: architecture only, zero code
- Domain purchased: halaljobs.ai
- Five artifacts exist (blueprint, prompt, tech spec, research, action plan) — location unclear from filesystem
- Reddit 4.1M job scraping approach: use JSearch API + Claude Haiku for classification (~$10-50 for 10-50k jobs seed)
- Fastest MVP: manually curate 200-500 jobs, skip pipeline for v1, validate search demand first
- Can clone Codefest stack almost entirely (Next.js + Supabase + Vercel)

---

## SESSION LOG

### Session 0 — February 27, 2026 (initialization)
- **Source:** Claude.ai daily driver session
- **Action:** Memory file created
- **Context:** HalalJobs architecture complete from Feb 21 session. Codefest deployed to Vercel from Feb 21 session. Neither generating revenue yet.
- **Strategic note:** These are longer-arc income plays. Scholarships are faster path to financial relief.

---

### Session 1 — February 27, 2026
- **Source:** Cowork session (continuation from compacted Claude.ai session)
- **Actions this session:**
  - Fixed About page: removed Devpost callout, replaced with category description
  - Rebuilt workspace as two-panel cockpit layout (committed fbce519)
  - Added Import from AI feature with structured template + paste-back parser (committed e0d4401)
  - Fixed mobile layout: workspace now stacks vertically on screens < 768px (committed f0cbaba)
  - Ran revenue assessment for both projects (see below)
- **Revenue assessment findings:**
  - Codefest is ~7h from $1. HalalJobs is 14h+ from MVP, no payment path after that
  - Next task for Codefest: pay-what-you-can modal on Export .md button (LemonSqueezy, no gating)
  - Corrected ACTIVE PRIORITIES: Codefest first, HalalJobs second
- **Analytics snapshot:** 21 visitors, 236 PV, 6 workspace sessions, 67% bounce, 90% USA, 86% desktop

---

*End of entries. Append new sessions below this line.*
