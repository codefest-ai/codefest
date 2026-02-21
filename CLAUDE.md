# CODEFEST.AI — CLAUDE.md
## Persistent Context for Claude Code / Cowork

---

## WHAT IS THIS PROJECT?

Codefest.ai is a **participant-facing hackathon infrastructure platform**. Not an event management tool (that's Devpost, TAIKAI, HackerEarth). Not a corporate innovation platform (that's HYPE, Ideanote). This is the tool that's open when the clock starts.

**One-line:** "Stop wasting the first hour."

**Extended:** Every existing hackathon platform serves organizers. None serve the person sitting at a laptop at 2am trying to figure out which auth library to use. Codefest.ai is the curated resource layer, team coordination space, and project preservation system that the hackathon ecosystem is missing.

---

## PROBLEM STATEMENT (DSR-Validated)

**Root cause (Five Whys):**
1. Hackathon participants waste critical time → produce unsustainable projects
2. No curated, context-aware resource layer for hackathon-specific needs
3. Existing platforms are organizer tools, not participant tools
4. Ecosystem treats events as isolated instances, not continuous learning
5. **ROOT:** No infrastructure connecting what was learned at previous hackathons to what's needed at the next one

**Evidence:** Only ~7% of hackathon projects have any activity 6 months after the event (Wikipedia/empirical research). MIT Sloan identifies "too many tools in the toolbox" as a top failure mode.

---

## ARCHITECTURE (6 Layers)

```
RESOURCE LAYER     → Curated component library (links to GitHub, not downloads)
TEAM LAYER         → Profiles, formation, roles, communication
PROJECT LAYER      → Planning, kanban, GitHub integration, whiteboard
LIVE COMP LAYER    → Clock-in, global dashboard, real-time progress
PRESERVATION LAYER → Project hosting, learning repo, fork/improve
ENTERPRISE LAYER   → School dashboards, judging, analytics, billing
```

**Build order:** Resource Layer first (standalone value), then Team, then Project. Other layers are future phases.

---

## TECH STACK

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Postgres + Auth + Realtime + Storage)
- **Vercel** for deployment
- **Domain:** codefest.ai (owned)

---

## KEY DESIGN PRINCIPLES

### 1. Curate and Link, Don't Host
Components link to GitHub repos and docs. We don't redistribute code. Value is in curation, context, setup time estimates, difficulty ratings, and compatibility notes. Like "shop the look" for code.

### 2. Participant-First
Every feature decision: "Does this help the person building at 2am?" If it only helps the organizer, it's not Phase 1.

### 3. Projects Live Beyond Demo Day
The Preservation Layer is what makes this different from everything else. Hackathon projects become learning resources, forkable by others, usable by the communities they were built for.

### 4. Islamic Compliance
No interest-based financing, no gambling mechanics, no haram product sponsors. Stripe/LemonSqueezy for payments. Clear value exchange.

### 5. Cynefin-Aware Scoping
Start in the simple domain (static resource library with curated links). Graduate to complicated (auth, teams, database). Complex features (AI assistant, real-time collab) come after the simple thing proves people show up.

---

## FILE LOCATIONS

```
C:\Users\evren\Codefest\
├── CLAUDE.md                          ← You are here
├── docs/
│   ├── CODEFEST_AI_BUILD_PACKAGE.md   ← Full 13-part spec ✅
│   ├── CODEFEST_AI_BUILD_PACKAGE_SUMMARY.md ← Condensed version ✅
│   ├── CODEFEST_IMPLEMENTATION_PLAN.md ← Phase 1 task breakdown ✅
│   ├── PROBLEM_DEFINITION.md          ← DSR problem analysis ✅
│   └── reference/
│       ├── EquityBridge_Lessons_Learned.md ← IST 601 lessons (Feb 2026)
│       └── codefest_landing_v1.html       ← Static landing page proof of concept (TODO: copy locally)
├── src/
│   ├── data/components_seed.json      ← 50 components seed data ✅
│   ├── app/                           ← Next.js pages (empty)
│   ├── components/                    ← React components (empty)
│   └── lib/                           ← Utilities (empty)
├── public/                            ← Static assets
├── package.json                       ← Already created
├── tailwind.config.ts                 ← Already created
├── tsconfig.json                      ← Already created
└── next.config.js                     ← Already created
```

---

## CURRENT STATE (Updated Feb 17, 2026)

**Ready:**
- Config files (package.json, tailwind, tsconfig, postcss, next.config, .gitignore)
- Full build spec (BUILD_PACKAGE.md) with database schema, folder structure, all 9 phases
- Phase 1 implementation plan with user stories and acceptance criteria
- DSR problem definition (Five Whys, competitive analysis)
- 50-component seed data (src/data/components_seed.json) with GitHub URLs, setup times, difficulty
- EquityBridge lessons learned (docs/reference/)
- Static HTML landing page as design reference

**Not yet done:** npm install, actual app code, Supabase setup, deployment

**NEXT STEP:** Open Cowork, point at C:\Users\evren\Codefest, tell it to read CLAUDE.md and start Phase 1

---

## WHAT TO BUILD FIRST

**Phase 1 Goal:** Deployed site at codefest.ai with:
1. Landing page (value prop, CTA)
2. Component library (browseable, filterable, links to GitHub/docs)
3. Google OAuth with .edu detection
4. Bookmark system (save components to your collection)

**Phase 1 is NOT:** Teams, competitions, kanban, real-time, AI. Those are Phase 2+.

---

## SIGNS (Learnings from EquityBridge)

### Sign: Capability creep kills alignment
- **Trigger:** Adding features that make the system do more TO users rather than WITH them
- **Instruction:** Every feature must pass "does this help the person at 2am?" test

### Sign: Efficiency ≠ collaboration
- **Trigger:** Optimizing for task completion over user agency
- **Instruction:** Include pause points — let users explore, don't automate through their "ok"

### Sign: Domain expertise enables validation
- **Trigger:** Testing with generic scenarios
- **Instruction:** Test with real hackathon participants. Evren has direct experience (CGU IST hackathon, EquityBridge). Use real scenarios.

---

## OWNER

**Evren Arat**
- CGU Transdisciplinary Studies MA
- Built EquityBridge (IST 601 hackathon project — lessons learned doc available)
- Throughline Systems, LLC founder
- Domain: codefest.ai (owned)

---

*Last updated: February 16, 2026*
