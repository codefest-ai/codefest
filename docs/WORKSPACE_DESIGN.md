# Codefest.ai — Workspace Design Rationale
## Why the Panels Are Ordered the Way They Are

*Written Feb 2026 — documents the DSR cascade rationale for the current workspace implementation*

---

## The Core Principle

The workspace is not a form. It's a thinking scaffold.

Most hackathon participants arrive with energy and no structure. They know they want to "build something with AI" or "fix something in healthcare" but can't translate that into a scoped, executable plan in the first hour. The workspace's job is to move someone from vague intention to specific stack decision — in the right order, without skipping steps.

The panel order is not arbitrary. It follows the Chatterjee Design Science Research (DSR) framework from IST 505, adapted for a 48-hour build context.

---

## The Panel Cascade

### Panel 1: Problem Framing
**What it does:** Forces articulation of who this is for and what specifically is broken.

**Why first:** You cannot evaluate tools before you know what you're building. The most common failure mode in hackathons is stack-first thinking — picking React Native before knowing if you're building a mobile app, or choosing PostgreSQL before knowing if your data is relational. The workspace refuses to let this happen by making problem framing non-skippable in the flow.

**Implementation:** Audience archetype cards (Student / Developer / Designer / Domain Expert) + freeform problem statement textarea + PROBLEM_FRAMES starter prompts. The archetype selection primes the user to think about who they are relative to the problem, not just what they want to build.

**Design decision:** Archetype selection is about self-identification (how do I approach problems?) not role assignment (what's my job title?). A "domain expert" is a nurse who understands healthcare problems but isn't a developer. A "student" is someone in their first or second hackathon, not necessarily a student by enrollment status.

---

### Panel 2: Impact Mapping (SDGs)
**What it does:** Connects the problem to a recognized framework of human needs.

**Why second:** After articulating the problem, participants often still lack specificity about *why it matters*. The SDG mapping step forces them to locate their problem in a recognized taxonomy. This does two things: it validates that the problem is real (if it doesn't map to any SDG, it's worth asking why), and it seeds the component suggestion engine with domain context.

**Implementation:** UN Sustainable Development Goals selection (multi-select). Selected SDGs are stored in `selectedSdgs[]` and used downstream to suggest components via fuzzy word-overlap matching against component `sdgs` fields in the seed data.

**Design decision:** SDGs were chosen over custom categories because they're internationally recognized, academically legitimate (important for the CGU pitch), and specific enough to drive meaningful suggestions without being so specific that they exclude valid problems.

---

### Panel 3: Domain Selection
**What it does:** Translates the abstract problem into a concrete technical domain.

**Why third:** With problem + impact defined, the user can now answer "what kind of system am I building?" The domain selection (climate, health, civic, education, etc.) is the bridge between problem framing and technical architecture. It's also the input that auto-populates GO! Mode's track selection.

**Implementation:** Domain cards with icons and descriptions. `selectedDomain` is used to: filter suggested components, pre-populate `goState.q3` (the track/focus field in GO! Mode), and eventually populate `profiles.domains[]` in Phase 2.

**Design decision:** Domains are broad by design. "Health" covers everything from maternal health apps to medication management to mental wellness tools. The specificity comes from the problem statement (Panel 1), not the domain selection.

---

### Panel 4: Patterns (Component Suggestions)
**What it does:** Surfaces relevant tools based on everything selected so far.

**Why fourth:** Only after problem, impact, and domain are defined can tool suggestions be meaningful. A suggestion of "Supabase" means something different to someone building a civic data tool than to someone building an AI-powered health app — even though the underlying technology is the same.

**Implementation:** All 50 components from the seed data are shown. Components whose `domains` or `sdgs` fields overlap with the user's selections float to the top with a "✦ match" badge. The plain language toggle (ℹ button) on each card switches between technical description and plain-language what/why for archetype 4 (domain experts).

**Soft suggestion algorithm:**
```ts
function getSuggestedComponents(domain: string, sdgs: string[]): string[] {
  const keywords = [
    ...domain.toLowerCase().split(/\s+/),
    ...sdgs.flatMap(s => s.toLowerCase().split(/\s+/))
  ]
  return components
    .filter(c => {
      const compWords = [
        ...(c.domains || []).flatMap((d: string) => d.toLowerCase().split(/\s+/)),
        ...(c.sdgs || []).flatMap((s: string) => s.toLowerCase().split(/\s+/))
      ]
      return keywords.some(k => compWords.includes(k))
    })
    .map(c => c.name)
}
```

**Design decision:** Suggestions are soft (float to top, not filtered out). Hiding non-matching components would create a false sense of completeness — the right tool for a problem might not be tagged for that domain in the seed data.

---

### Panel 5: Stack Builder
**What it does:** Lets the user assemble their specific technology choices.

**Why fifth:** After seeing what's available (Panel 4), the user makes intentional selections. This is the transition from exploration to commitment. The stack selection becomes the session's output — it's what gets preserved and eventually flows into the profile's "tools used" section.

**Implementation:** Selected components tracked as a set. Setup time estimates surface in this panel so the user can see total estimated setup time for their chosen stack (sum of individual setup times).

**Design decision:** No "recommended stack" button. Forcing the user through the selection process, even briefly, creates ownership of the decision. A pre-filled stack they didn't choose is a stack they don't understand.

---

### Panel 6: GO! Mode
**What it does:** Generates an actionable project brief from everything collected in panels 1-5.

**Why last:** GO! Mode is synthesis, not input. It takes what was built through the cascade and produces a structured output: project name suggestion, recommended stack summary, initial task list framing, and track selection.

**Auto-population:** Because the user already answered the underlying questions in panels 1-5, GO! Mode pre-fills its fields rather than asking them again:
- `selectedDomain` → auto-populates track/focus (`goState.q3`)
- `selectedAudience` → auto-populates team profile (`goState.q2`)
- Problem statement from Panel 1 → seeds project brief

**The "✦ some answers pre-filled from your session" indicator** signals that GO! Mode is connected to the rest of the workspace — it's not a standalone tool, it's the cascade's output.

**Design decision:** GO! Mode was originally designed as a separate panel with its own Q&A. This created redundancy — users who had just answered questions in panels 1-5 were asked the same questions again in different framing. The auto-population fix eliminated the redundancy while preserving GO! Mode as a distinct, memorable end state.

---

## What the Cascade Is Not

**Not a form.** Forms collect information. The cascade generates understanding. A user who completes the cascade hasn't filled out a form — they've thought through their problem in a structured way that most hackathon teams skip.

**Not a chatbot.** The cascade doesn't ask questions sequentially and wait for answers. All panels are visible (collapsed by default, expand on click or auto-advance). Users can jump out of order if they know what they're doing. The structure is available as a scaffold, not imposed as a script.

**Not scope-defining.** The cascade doesn't tell you what to build. It helps you articulate what you're already trying to build. The problem statement is the user's, not the platform's.

---

## Connection to Phase 2

The cascade data doesn't currently persist server-side. In Phase 2, a `workspace_sessions` table captures each completed session and attributes it to a profile. This is what makes the "tools used" section of a participant profile genuinely earned — it reflects what they actually considered and selected during real build sessions, not what they claimed to know.

See: `PHASE2_SPEC.md → Workspace → Profile Connection`

---

## Editorial Reference

All copy in the workspace (panel headers, placeholder text, archetype descriptions, PROBLEM_FRAMES starters) follows the Codefest editorial voice: direct, practitioner-grounded, non-patronizing.

See: `CODEFEST_EDITORIAL_SMART_PROMPT.md`

---

*Feb 2026 — documents src/app/workspace/page.tsx implementation*
