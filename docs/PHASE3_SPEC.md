# Codefest.ai — Phase 3 Spec
## Live Competition Infrastructure + AI Assistant Layer

*Stub — drafted Feb 2026. Flesh out after Phase 2 has 200+ active profiles.*

---

## What Phase 3 Is

Phase 3 is what makes Codefest feel alive during an event. Phase 1 is the library. Phase 2 is the identity layer. Phase 3 is the real-time layer — clock ticking, people joining, projects forming, an AI assistant helping when someone is stuck at 2am.

Three components:
1. **Live competition dashboard** — real-time event view, global participant activity
2. **Real-time team coordination** — in-platform messaging replacing Discord for event-duration coordination
3. **AI assistant layer** — contextual help grounded in the component library and participant's workspace session

Phase 3 is what the school partnership pitch becomes after CGU runs one or two events on Phase 2 infrastructure. It's the thing that makes "run your hackathon on Codefest" a better offer than anything else on the market.

---

## Prerequisites

Before Phase 3 starts:
- [ ] 200+ active participant profiles (Phase 2)
- [ ] At least 1 institutional partner event run end-to-end (Phase 2)
- [ ] Supabase Realtime validated at event scale (stress test during Phase 2 events)
- [ ] AI assistant prompt system designed (see `CODEFEST_EDITORIAL_SMART_PROMPT.md` — Phase 3 note)

---

## Part 1: Live Competition Dashboard

### What It Is

During an active hackathon, a global view showing: how many people are clocked in, what domains they're working in, project activity, time remaining. Not a leaderboard. Not competitive pressure. A sense of shared context — "here's the room."

### Clock-In / Clock-Out

When a registered participant opens the workspace during an active event, they're prompted to "clock in" — this marks them as actively building. Clock-out is automatic (inactivity detection) or manual.

```
Event: CGU Hacks Spring 2026
⏱ 14h 32m remaining

🟢 34 participants clocked in
   12 working in AI + Health
   8 working in Civic Tech
   14 working in Open domain

Your team: [You] + [Priya] + [Nabil]
```

### Organizer Dashboard (Institutional)

Organizers see: registration list, clock-in status, team formation activity, submission count, judging queue. This replaces the spreadsheet + Discord + email chaos of current institutional hackathon management.

Judging interface: rubric-based scoring, multi-judge support, automatic score aggregation.

---

## Part 2: Real-Time Team Coordination

### Scope

Not a full Slack replacement. Event-duration coordination only — messages expire after the event ends (or are archived to the team's project record). The goal is eliminating the Discord dependency for active build coordination, not building a persistent social network.

### Channels Per Event

Each event gets:
- `#general` — announcements from organizer
- `#find-a-team` — links to team formation board (Phase 2)
- `#resources` — Codefest component library links, workshop recordings
- Per-team private channel (created when team forms)

### Tech

Supabase Realtime (already in stack) handles message pub/sub. No new infrastructure required — this is a UI layer on existing capabilities.

### What It Replaces

Discord. Every institutional hackathon currently pushes participants to a Discord server that gets abandoned after the event. Codefest keeps coordination inside the platform, which means the conversation history is available when the team writes their project retrospective.

---

## Part 3: AI Assistant Layer

### What It Is

A contextual AI assistant available during the workspace — not a general chatbot, a grounded advisor. It knows:
- What the participant has selected in their workspace session (problem, domain, stack)
- The full Codefest component library (50 tools with plain language descriptions, setup times, gotchas)
- The participant's profile (tools used before, domains worked in)

It does not hallucinate tool recommendations. It surfaces from the library. If someone asks "what should I use for auth?" it recommends from the curated set with the same editorial voice as the written component deep dives.

### Grounding Rules (from editorial smart prompt)

The AI assistant inherits the Codefest editorial constraints:
- Never recommend a tool not in the curated library without flagging it as unvetted
- Always cite setup time and difficulty rating alongside recommendations
- Surface the "when NOT to use this" as readily as the "when to use this"
- If uncertain, say so — don't manufacture confidence

### Scope Boundaries

The assistant helps with:
- Tool selection ("what should I use for payments given I'm using Supabase?")
- Setup guidance ("how do I connect Next.js to Supabase Auth?")
- Problem scoping ("my problem statement is X, what am I missing?")
- Stack review ("here's what we have so far, what are the gaps?")

The assistant does NOT:
- Write code (that's GitHub Copilot's job)
- Make product decisions ("should I build feature X?")
- Replace human mentors at events
- Operate outside the hackathon/technical domain

### Implementation Approach

Claude API (Anthropic) with a structured system prompt derived from `CODEFEST_EDITORIAL_SMART_PROMPT.md` + injected context from the user's active workspace session. The assistant prompt is a separate governed artifact — see the "What This Prompt Does Not Do" section of the editorial smart prompt.

RAG (retrieval-augmented generation) over the component library means the assistant's tool recommendations are always grounded in the actual curated data, not training data.

---

## Database Additions (Phase 3)

```sql
-- Event clock-ins
CREATE TABLE event_clockins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES competitions(id),
  profile_id uuid REFERENCES profiles(id),
  clocked_in_at timestamptz DEFAULT now(),
  clocked_out_at timestamptz,
  UNIQUE(event_id, profile_id)
);

-- Event messages (expires post-event)
CREATE TABLE event_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES competitions(id),
  team_id uuid REFERENCES teams(id), -- null = public channel
  profile_id uuid REFERENCES profiles(id),
  channel text NOT NULL DEFAULT 'general',
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- AI assistant sessions (for context persistence within a session)
CREATE TABLE assistant_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id),
  workspace_session_id uuid REFERENCES workspace_sessions(id),
  messages jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Judging
CREATE TABLE judging_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES competitions(id),
  project_id uuid REFERENCES showcase_projects(id),
  judge_id uuid REFERENCES profiles(id),
  criteria jsonb NOT NULL, -- {innovation: 8, impact: 7, execution: 9, presentation: 6}
  notes text,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(event_id, project_id, judge_id)
);
```

---

## Page Inventory (New in Phase 3)

- `/events/[slug]/live` — live dashboard during active event
- `/events/[slug]/judge` — judging interface (organizer/judge role only)
- `/events/[slug]/team/[team-id]` — team coordination view with messaging
- Workspace: AI assistant panel (new panel or slide-in sidebar)

---

## The Institutional Pitch at Phase 3

By Phase 3, the school partnership pitch becomes:

"You run your hackathon on Codefest. Your participants get a curated resource library active the moment the clock starts. Teams coordinate inside the platform — no external Discord server. You have a live dashboard showing who's clocked in, what they're working on, and how many teams have formed. An AI assistant helps participants who are stuck without requiring a mentor to be online at 2am. After the event, every project is preserved with the team's coordination history and tool choices. And you have data: what tools were used, how long teams spent in different phases, which teams used the AI assistant and how. That's publishable research data for a university running an ethical AI hackathon."

No other platform can make that pitch.

---

## Revenue Unlock (Phase 3 → Phase 4)

Phase 3 is what validates Track A events (Official Codefest sponsor-funded hackathons) at scale. Once the live dashboard, team coordination, and AI assistant are live, sponsor value is measurable: "Here's the API usage data during our event. Here's how many teams integrated your tool. Here's the project showcase featuring work built with your product." That data is the foundation of the sponsor tier pricing in Phase 4.

---

*Preceding: PHASE2_SPEC.md*
*Following: PHASE4_SPEC.md*
*See also: WORKSPACE_DESIGN.md, CODEFEST_EDITORIAL_SMART_PROMPT.md*
