# CODEFEST.AI — DSR PROBLEM DEFINITION
## Design Science Research Problem Analysis
### IST 505 Framework (Chatterjee Method)

---

## RESEARCH QUESTION

**RQ:** How might we design participant-facing hackathon infrastructure that reduces wasted time, improves project sustainability, and preserves collective knowledge across events?

---

## THE PROBLEM (Not the Solution)

### Surface Problem
Hackathon participants waste the first 1-3 hours on tool selection, boilerplate setup, and resource hunting instead of building.

### Five Whys Analysis

**WHY #1:** Teams spend critical early hours on setup, not building.
→ Because there's no curated, context-aware resource layer for hackathon-specific needs. Participants search Stack Overflow, GitHub, Medium, YouTube independently under time pressure.

**WHY #2:** No participant-facing resource infrastructure exists.
→ Because existing platforms (Devpost, TAIKAI, HackerEarth, AngelHack) are organizer tools. They handle registration, judging, submission — not the actual building experience.

**WHY #3:** The ecosystem serves organizers, not participants.
→ Because hackathons are treated as isolated instances rather than a continuous learning community. Each event starts from zero. No accumulated knowledge transfers.

**WHY #4:** Events are isolated, not connected.
→ Because there's no infrastructure connecting what was learned at previous hackathons to what's needed at the next one. Knowledge dies after demo day.

**WHY #5 (Root Cause):** No preservation or knowledge transfer infrastructure.
→ Empirical evidence: Only ~7% of hackathon projects show any activity 6 months after the event. The vast majority become abandoned repositories.

### Fishbone Categories

| Category | Contributing Factors |
|----------|---------------------|
| **Resources** | No curated library; participants reinvent tool selection every event |
| **Time** | 24-48 hour constraint; first hours lost to setup, not building |
| **Tools** | "Too many tools in the toolbox" (MIT Sloan); fragmented across platforms |
| **Knowledge** | No transfer between events; winning project breakdowns not accessible |
| **Continuity** | Projects die post-demo; communities never receive tools built "for" them |
| **Ecosystem** | All infrastructure optimized for organizer workflow, not participant experience |

---

## STAKEHOLDER ANALYSIS

| Stakeholder | Current Pain | What They Need |
|-------------|-------------|----------------|
| **Participants** | Wasted first hour; reinventing stack choices every time | Curated resources, quick-start guidance |
| **Teams** | Role confusion; communication scattered across tools | Clear coordination space during event |
| **Projects** | Die after demo day; repos go stale | Preservation, discoverability, forkability |
| **Communities** | Never receive tools built "for" them | Access to maintained, usable outputs |
| **Schools/Organizers** | Juggle 5+ tools per event | Unified platform reducing tool chaos |
| **Sponsors** | Logo placement, no real engagement data | Meaningful participation metrics |

---

## COMPETITIVE LANDSCAPE

| Platform | Serves | Does NOT Serve |
|----------|--------|---------------|
| **Devpost** | Project showcase, submissions, judging | Building experience, resource curation |
| **TAIKAI** | Event management, NFT integration | Participant tooling during build |
| **HackerEarth** | Technical recruitment, assessments | Hackathon building experience |
| **AngelHack** | Enterprise hackathon-as-a-service | Individual participant needs |
| **InnovationCast/HYPE** | Corporate idea management | Student/community hackathons |
| **GitHub** | Code hosting | Curation, context, hackathon-specific guidance |

**The gap:** Nobody builds for the person at the laptop. Every platform optimizes for the person running the event.

---

## DESIGN REQUIREMENTS (From Problem Analysis)

### Must Address:
1. **Time waste** → Curated, filterable component library with setup times and difficulty ratings
2. **Knowledge loss** → Preservation layer where projects live beyond demo day
3. **Tool fragmentation** → Single platform reducing multi-tool chaos
4. **Starting from zero** → Winning project breakdowns showing what was used and how

### Must NOT Do:
1. Replace GitHub (link to it, don't compete with it)
2. Become another organizer dashboard (participant-first always)
3. Optimize for engagement over utility (respect time pressure)
4. Require setup time itself (instant value from first visit)

---

## ARTIFACT DEFINITION

**The artifact:** A web platform (codefest.ai) with four initial capabilities:

1. **Component Library** — Curated directory of hackathon-ready tools/libraries with GitHub links, setup time estimates, difficulty ratings, compatibility notes, and editorial context. "Shop the look" for code.

2. **Winning Project Showcases** — Breakdowns of successful hackathon projects showing every component used, how they connected, lessons learned, and build time. Forkable.

3. **Personal Toolkit** — Bookmarking system where participants build their own curated collection before events.

4. **Project Preservation** — After events, projects hosted as living learning resources rather than abandoned repos.

---

## EVALUATION CRITERIA

### Technical Evaluation:
- Does the component library reduce setup time? (Measurable: time-to-first-commit)
- Are winning project breakdowns useful? (Measurable: engagement, fork rate)
- Do bookmarks get reused across events? (Measurable: return usage)

### Impact Evaluation (Chatterjee Priority):
- **Did participant behavior change?** Did teams start building faster?
- **Did project sustainability improve?** Are preserved projects maintained longer than the 7% baseline?
- **Did knowledge transfer occur?** Are components from showcases reused in new projects?

### The Real Test:
Does a professor say "everyone open Codefest" when the clock starts?

---

## RELATIONSHIP TO OTHER WORK

### EquityBridge (IST 601)
Same team member (Evren) built a participant-facing tool with similar design tensions. Key lessons directly applicable:
- Capability creep vs. design intent
- Efficiency ≠ collaboration
- Pause points transform interaction
- Domain expertise enables real validation

### Throughline Systems
Codefest.ai operates on the same philosophical foundation: coordination infrastructure should serve the person being coordinated, not the institution coordinating them. Hackathon participants are to Codefest what Regional Center consumers are to Throughline — the people the system should center but currently doesn't.

---

*Problem definition created: February 16, 2026*
*Framework: Chatterjee IST 505 Design Science Research*
*Ready for solution design phase*
