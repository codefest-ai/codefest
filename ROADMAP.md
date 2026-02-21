# Codefest.ai — Product Roadmap

*Living document. Ideas captured as they emerge.*

---

## Shipped (v1 — Feb 2026)

- Component library (browse, filter, bookmark)
- Workspace (session planning, domain + SDG selection, GO! mode)
- Google OAuth + .edu detection
- Teams (create, invite code, roles, join by code)
- Project boards (kanban per team)
- Competitions (clock-in, live dashboard, countdown)
- Showcase (submit projects, link to Devpost/GitHub, curated context layer)
- Blog (MDX, static, RSS feed)
- OG image generation (dynamic per page)
- SEO + sitemap

---

## Near-term (Post-launch, weeks 2–4)

- Run migrations 002–005 (teams, projects, competitions, showcase)
- Showcase seed submissions (submit EquityBridge + any other known projects)
- Blog: 3–5 more posts (component deep-dives, winning patterns, SDG guides)
- RSS aggregation: pull from Devpost + HackerNews filtered for "hackathon" keywords
- Feedback mechanism (Tally or Typeform embed, mailto link)

---

## Medium-term

### Solo Mode
- User sets their own time budget (no event required) — 4 hours, 8 hours, 12 hours, custom
- Full workspace flow: domain → SDGs → stack → planning → build → submit to showcase
- Timer runs in-app, visible throughout session
- Output: structured project card ready to submit to showcase at end
- Turns codefest.ai from event-dependent → continuous daily practice platform

### Build Audit Trail
- Forensic reconstruction of how a project came together
- Timestamped log: what was opened, what was bookmarked, what components were selected, when planning started vs. first commit
- Time actually spent per phase vs. time allocated
- Where teams got stuck (long gaps, abandoned kanban cards)
- Not surveillance — opt-in, visible to the team, shareable in showcase submission
- Closes the "process is invisible" gap — you only see outputs now, not how they were built

### Collective Intelligence Layer
- Aggregate anonymized patterns across sessions
- "Climate projects average X hours on auth"
- "Teams that pick domain before stack complete 40% more kanban cards"
- "These 6 components appear in 80% of health hackathon winners"
- Powers smarter GO! mode recommendations
- Research-grade data on hackathon behavior that doesn't exist anywhere

---

## Longer-term

### External Platform Integration
- Devpost API: pull featured/winning projects into showcase automatically
- GitHub Topics: surface repos tagged `hackathon` with curated context
- Dorahacks, TAIKAI feeds

### AI GO! Mode v2
- Context-aware stack recommendations based on domain + SDG + time budget
- "Teams like yours used X, Y, Z and shipped in 18 hours"
- Pulls from collective intelligence layer

### GitHub Integration
- Connect repo to project board
- Auto-populate stack from package.json
- Commit activity visible in team dashboard during competition

### Enterprise / School Layer
- Professor dashboard: "everyone open Codefest when the clock starts"
- Class hackathon management (organizer view, not competing with participant tools)
- School analytics: which components students use, project sustainability rates
- Billing via Stripe/LemonSqueezy — clear value exchange

### Preservation Layer v2
- Projects submitted to showcase become forkable templates
- "Start from this project" → clones stack, domain, SDG selections into new workspace session
- Communities can find and fork tools built "for" them

---

## Design Principles (don't lose these)

- **Curate and Link, Don't Host** — we add context, we don't compete with GitHub/Devpost
- **Participant-First** — every feature must pass "does this help the person at 2am?"
- **Process is data** — the how of building is as valuable as the what
- **Continuous, not event-dependent** — solo mode makes the platform run 365 days a year
- **Islamic compliance** — no interest-based mechanics, no gambling, clear value exchange

---

*Started: February 2026*
*Framework: Chatterjee DSR (IST 505)*
