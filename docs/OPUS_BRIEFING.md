# Codefest.ai — Strategic Briefing for Claude Opus
*Prepared Feb 21, 2026 — for deeper strategic input*

---

## What Is This

**Codefest.ai** is a participant-facing hackathon infrastructure platform. Not an organizer tool (that's Devpost, HackerEarth). Not a corporate innovation platform. This is the tool that's open when the clock starts.

**One-line:** "Stop wasting the first hour."

**Root problem:** Every existing hackathon platform serves organizers. None serve the person sitting at a laptop at 2am trying to figure out which auth library to use. Only ~7% of hackathon projects have any activity 6 months after the event. MIT Sloan identifies "too many tools in the toolbox" as a top failure mode.

**Owner:** Evren Arat — CGU Transdisciplinary Studies MA student, founder of Throughline Systems LLC. Built EquityBridge at a CGU IST 601 hackathon. Direct access to CGU faculty/organizers. Domain codefest.ai owned.

---

## Current State (Phase 1 — live)

- Component library: 50 curated tools with setup times, difficulty ratings, GitHub links
- Workspace: problem-first planning tool (DSR Chatterjee framework — Problem → SDGs → Domain → Patterns → Stack → GO!)
- Showcase: project submission and preservation
- Google OAuth with .edu detection
- Bookmark system
- Individual component pages (SEO — /library/[slug])
- Category editorial pages (/library/category/[cat]) — teaches WHY not just HOW
- Deployed at codefest.ai on Vercel + Supabase

**Tech stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Vercel

---

## Architecture (6 Layers — build order)

```
RESOURCE LAYER     → Curated component library ✅ LIVE
TEAM LAYER         → Profiles, formation, roles, communication (Phase 2)
PROJECT LAYER      → Planning, kanban, GitHub integration (Phase 2)
LIVE COMP LAYER    → Clock-in, global dashboard, real-time progress (Phase 3)
PRESERVATION LAYER → Project hosting, learning repo, fork/improve (Phase 2 stub ✅)
ENTERPRISE LAYER   → School dashboards, judging, analytics, billing (Phase 3-4)
```

---

## Business Model Ideas — Input Needed

### 1. School Partnership Model
CGU Hacks (and most university hackathons) currently use 4 fragmented tools:
- Custom WordPress info site
- University registration form
- Discord for team formation
- Devpost for project submission
- Paper rubrics for judging

**Proposal:** Codefest runs the entire hackathon for schools. "CGU Hacks, powered by Codefest."

**Value to schools:**
- One platform replaces four
- Data they never had: what tools participants used, time spent in planning vs. building, project quality metrics, post-event preservation
- Aligns with research mission (publishable data on hackathon outcomes)
- Evren has direct access to CGU organizers as a current student

**Revenue models under consideration:**
- Flat fee per event
- Revenue share on sponsorships
- Annual institutional subscription

**Questions for Opus:**
- How do you sequence the pitch — product-first or relationship-first given Evren's CGU connection?
- What's the right pricing structure for a university client at this stage?
- How do you avoid getting pigeonholed as "the CGU tool" vs. scaling the institutional model?
- What's the moat — what stops Devpost from adding a resource library?

---

### 2. Sponsorship Model
Companies sponsor hackathon events as a marketing/advertising expense (not charity). This works regardless of nonprofit status — they deduct it as a marketing budget item.

**Pitch:** "Your API/tool is open in front of 500 developers actively building for 48 hours. Not listed on a sponsor slide — integrated into the resource library they're using during the build."

**Shariah compliance filter:** Evren wants to be selective about sponsors — no conventional interest-based banking, no haram industries. This actually aligns with CGU's ethical AI framing and becomes a differentiating brand position ("ethically sponsored hackathons").

**Questions for Opus:**
- What's the sponsor acquisition playbook for a new platform with early traction?
- Which sponsor categories are most naturally aligned (dev tools, Islamic fintech, ethical AI companies)?
- How do you price sponsorship packages at early stage?

---

### 3. Bounty Hackathon Model (Phase 4)
**Concept:** Pay-to-enter skill competitions where the prize pool is funded by participants + sponsors + Codefest. Platform takes a cut on settlement.

**Two tracks:**

**Track A — Official Codefest events (clean, immediate):**
- Evren funds prize pool personally or via sponsors
- Participants enter for free or pay access/operational fee (not prize pool)
- Platform takes cut from sponsorship revenue
- Legally clean: third-party sponsored skill competition
- Shariah clean: musabaqah (skill competition) with third-party prize donor

**Track B — Community-run bounty pools (Phase 4+):**
- Groups set up their own: "$50 × 20 people = $1000 prize pool"
- Codefest takes 10-15% on settlement
- Legally complex: sweepstakes laws vary by US state, money transmitter license risk
- Potential solution: Clarity smart contracts on Stacks blockchain — participants send funds directly to contract, contract pays out on condition. Codefest is facilitator, not money holder.

**Shariah considerations on bounty pools:**
- Skill competition (musabaqah) vs gambling (maysir) — scholars generally permit skill-based competitions
- Classical fiqh condition: prize ideally from third party, not purely from participants wagering against each other
- The Stacks/Clarity approach helps: no interest accrues in escrow, terms are transparent and deterministic, Codefest doesn't hold funds
- Transferable token (CodeCoin) raises gharar/speculation concerns — start with non-transferable reputation points

**Questions for Opus:**
- Is the Track A model (Evren sponsors, community builds) actually the stronger long-term play, or is the self-funding bounty pool model worth the legal/Shariah complexity?
- How do you think about the Shariah compliance of participant-funded prize pools — is the "third party contribution" solution sufficient or does it need deeper structuring?
- What's the right moment to introduce crypto rails vs. fiat-first?

---

### 4. CodePoints / Reputation System
**Concept:** Non-transferable reputation score earned by:
- Completing hackathons
- Quality project reviews
- Contributing to the community
- Helping teammates

**Purpose:** Unlocks access to higher-tier bounty events. Verifiable profile signal for career/hiring. "I have 340 CodePoints — 8 hackathons, 3 in AI+health domain" is a more concrete signal than LinkedIn endorsements.

**Later phase:** Potentially transferable token (CodeCoin) — but only with Islamic finance legal opinion and regulatory clarity on securities classification.

**Questions for Opus:**
- Is the soul-bound reputation model the right framing, or does it feel punitive/gamified in a way that alienates participants?
- How do you design reputation systems that reward depth over gaming (someone doing 50 low-effort hackathons vs 5 serious ones)?
- Is CodeCoin ever worth pursuing or does it always create more problems than it solves?

---

### 5. The Live Discovery Layer (Phase 2-3)
**Concept:** "Hackathon starting in 3 hours — 24 participants, 8 spots left."

- Event cards with live countdown, participant count, spots remaining
- Filter by: starting soon / online / theme / institution
- Community-run hackathons (anyone creates one in 3 minutes)
- Recurring infrastructure (weekly open hack nights, monthly themed sprints)
- Pre-event "looking for team" board (structured: role needed, domain, time zone) — replaces Discord #find-a-team channel
- Clock-in connects to workspace: resource library pre-filtered to event domain

**Questions for Opus:**
- What's the minimum viable version of this that creates real discovery value without needing a large existing user base?
- How do you solve the cold start problem — events need participants, participants need events?
- Should Codefest own the event calendar or aggregate from Devpost/MLH and add the tooling layer on top?

---

## Key Design Principles (from CLAUDE.md)

1. **Participant-first:** Every feature — "does this help the person building at 2am?"
2. **Curate and link, don't host:** Value is in curation, context, ratings — not redistribution
3. **Projects live beyond demo day:** Preservation layer is the key differentiator
4. **Islamic compliance:** No interest-based financing, no gambling mechanics, no haram sponsors. Clear value exchange.
5. **Cynefin-aware scoping:** Start simple (static resource library). Graduate to complicated (auth, teams, database). Complex features (AI, real-time) come after simple thing proves people show up.

---

## Competitive Landscape (quick summary)

- **Devpost:** Dominant, organizer-focused, no participant tooling during build, no resource layer
- **lablab.ai:** AI-only, has live countdowns + participant counts, still organizer-focused
- **MLH:** Student events, no tooling, just coordination
- **HackerEarth:** Enterprise/technical, coding assessments, no resource layer
- **None** of them have: curated resource library active during build + project preservation + participant profiles as career artifacts

---

## Questions for Opus — Open Strategic

1. Is the sequencing right? Resource library → profiles → live events → school partnerships → bounty pools?
2. What's the right way to think about Shariah compliance as a brand position vs. a constraint? Is "ethically funded hackathons" a marketable differentiator or does it limit TAM?
3. CGU partnership as proof of concept — what does success look like at the end of year 1 that makes year 2 fundable or self-sustaining?
4. What's missing from this model that you'd flag before the next build phase?

---

*Full build spec: docs/CODEFEST_AI_BUILD_PACKAGE.md*
*Phase 1 implementation: docs/CODEFEST_IMPLEMENTATION_PLAN.md*
*Problem definition: docs/PROBLEM_DEFINITION.md*
