# Hackathon Ecosystem Research
*Generated: March 1, 2026 — for Codefest.ai positioning*

---

## MARKET SIZE (Validated)

- **MLH alone:** 200+ hackathons in 2026 season, 150K+ participants per season, 12,500+ projects created
- **MLH total reach:** 500K+ developers across all programs
- **Devfolio (India-heavy):** Thousands of students, active grant programs with AWS
- **sahat/hackathon-starter:** 35K GitHub stars, 8.2K forks — this is the clearest demand signal for the exact problem Codefest solves

The 35K stars on a Node boilerplate from 2014 is the single most important data point. People have been screaming for this for a decade and nobody has built the modern, curated version.

---

## WHERE PARTICIPANTS ACTUALLY ARE

### Primary Communities (High Signal)

| Platform | Size | Notes |
|---|---|---|
| **MLH Discord** (`discord.mlh.io`) | 55K+ members | #team-formation, #hack-together channels — pure target audience |
| **Devpost Discord** (`discord.gg/HP4BhW3hnp`) | 48K members | Project feedback channels, hackathon announcements |
| **Global Hack Week (MLH)** | Monthly, 100% free | Online, themed weeks (AI/ML, Beginners, Data) — runs all year |
| **r/hackathon** | 5.4K members | Small, India-heavy, low engagement, but real participants |
| **Devfolio** | India focus | Student grants + AWS credits, very active |
| **dev.to** | Large dev audience | MLH-acquired, hackathon tag active, editorial posts perform well |
| **HN (Hacker News)** | Tech-heavy | Boilerplate discussions active, see HN thread on SaaS starters |

### Where To Listen (Research Mode, Not Posting)
- **Devpost project pages** → "How We Built It" sections = pain point goldmine (blocked from scraping, manual research needed)
- **GitHub Issues on hackathon-starter repos** → explicit complaints about what's broken/missing
- **MLH Discord #team-formation** → what skills people are looking for = what's missing from their toolkit

---

## VALIDATED PAIN POINTS (Evidence-Based)

### 1. Setup Time Kills Momentum
The original `sahat/hackathon-starter` (35K stars) exists entirely because:
> "Getting a hackathon project started takes considerable time, from choosing a programming language and frameworks to setting up initial project infrastructure."

Issue #876 (real GitHub issue) shows participants' first step is **removing** all the API/auth examples from boilerplates before they can start. They want a blank canvas with the hard parts pre-solved — not a cluttered demo.

### 2. Auth Is The #1 Setup Killer
Multiple sources confirm:
> "Sign in with Facebook can take hours if you're not familiar with OAuth 2.0."
> "APIs that require HTTPS need ngrok, start ngrok after starting the project..."

This is **exactly** what codefest's component library solves — rate each auth option by setup time, difficulty, hackathon-appropriateness.

### 3. Environment Sync Wastes Team Time
> "Setting up each team member's environment locally can take more than 20 minutes"

In a 24-hour hackathon, one 20-minute setup × 4 team members = 80 minutes gone before a line of feature code is written.

### 4. The First Hour Is The Most Expensive
From the AthenaHacks post — someone spent **four hours** at their first hackathon just trying to pick an idea. The resource layer (curated stacks + component library) directly addresses this.

### 5. Ideation Paralysis Is Real
The r/hackathon post "Hackathon ideation always felt messy, so I built a tool to structure it" got 2 upvotes — but it confirms there's enough pain that someone built something. Codefest's curation layer (what stack for what use case) is the answer.

---

## VALIDATED TECH STACK PATTERNS (What Winners Use)

The Next.js + Supabase + Vercel stack has become the **de facto** hackathon winner stack:
- One-click deploy (Vercel)
- Built-in auth + database + realtime (Supabase)
- Full-stack in one repo (Next.js App Router)

**Implication for codefest component library:** Prioritize components that plug into this stack. Every component should have a "setup time with Supabase" rating.

### Other patterns observed in winning projects:
- **AI/ML integration** (OpenAI, Claude API) — MLH Global Hack Week AI/ML Week is monthly
- **Adobe Express API** — MLH partner, shows up in challenges
- **Oracle Autonomous Database** — MLH partner

---

## CONTENT STRATEGY (What Actually Gets Upvotes)

### On r/hackathon:
- Genuine advice/experience posts: 15-23 upvotes
- Tool promotion posts: 1-5 downvotes
- **Play:** Reply to existing pain threads (not post a launch)

### On dev.to:
- Hackathon tag is active, MLH owns the platform
- Editorial posts ("How to Win Any Hackathon") perform well
- **Play:** "I analyzed 50 winning hackathon stacks — here's the pattern" → links naturally to codefest component library

### On MLH/Devpost Discord:
- Contribution first, resource after
- Answer questions in #mentors or #help channels
- **Play:** Become a regular, then mention codefest when relevant

### On HN:
- The "Ask HN: What are some good modern SaaS starter boilerplates?" thread had active discussion
- **Play:** Post "Show HN: Codefest — curated hackathon stack for the first 2 hours" — this is an HN-appropriate launch

---

## COMPETITIVE LANDSCAPE (Platforms That Exist)

| Platform | What It Does | Gap |
|---|---|---|
| **Devpost** | Submit projects, find hackathons | Organizer-facing, no participant resource layer |
| **Devfolio** | Same as Devpost, India-heavy | Same gap |
| **MLH** | Runs events, Discord community | Resource curation is zero |
| **sahat/hackathon-starter** | Node.js boilerplate | 2014-era tech, unmaintained, no curation/ratings |
| **HackerEarth** | Corporate hackathon hosting | Enterprise-only, no participant tools |
| **GitHub topics/hackathon-starter** | Various boilerplates | Fragmented, no ratings, no compatibility notes |

**Codefest's unique position:** Nobody curates the *participant experience* with context-aware ratings (setup time, difficulty, hackathon-appropriateness, stack compatibility). The closest thing is a 10-year-old Node boilerplate with 35K stars and an open issue asking for a simpler version.

---

## IMMEDIATE ACTION OPPORTUNITIES

1. **MLH Discord** — join, lurk in #team-formation and #help, contribute answers, mention codefest naturally after 1-2 weeks
2. **r/hackathon** — reply to the "ideation felt messy" thread + the "best websites to find hackathons" thread as a resource, not a pitch
3. **dev.to post** — write "The 2026 Hackathon Stack: What Winners Actually Use" as editorial content, codefest as natural CTA
4. **Devfolio** — research India-specific pain (heavy student market, AWS credits = cost-conscious, boilerplate demand is high)
5. **HN Show HN** — plan for post-MVP launch, not now — HN rewards working things

---

*Sources: MLH, Devpost, Devfolio, dev.to search results, GitHub issues, r/hackathon subreddit analysis*
