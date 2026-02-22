# Codefest.ai — Phase 2 Spec
## Profiles + Live Hackathon Discovery

*Drafted Feb 2026 — following Phase 1 launch*

---

## What Phase 2 Is

Phase 1 proved people show up. Phase 2 gives them a reason to come back and a reason to bring others.

Two interlocking pieces:
1. **Participant profiles** — identity layer, career artifact, prerequisite for everything social
2. **Live hackathon discovery** — events directory, countdown, join flow, team formation

These are sequenced: profiles first, then discovery. You can't have a useful event registration flow without a participant identity to attach it to.

---

## Why This Sequence

Profiles unlock:
- A reason to create an account beyond bookmarking
- The institutional pitch ("what do participants get out of having an account?")
- The foundation for team formation, event registration, reputation scoring
- A career artifact that gets better with every event attended

Discovery unlocks:
- The live layer that makes Codefest a platform, not just a library
- Real use cases for profiles (you need one to join an event)
- Network effects (events need participants, participants discover events)
- The CGU partnership pitch (run your hackathon here — not vaporware, live infrastructure)

---

## Part 1: Participant Profiles

### What a Profile Is

Not a settings page. A **career artifact** — the thing you'd link from a portfolio or a job application that says more than "proficient in React."

A senior developer has work history. A CGU grad student building their first real project at 2am doesn't. A Codefest profile is how that person shows: what domains they work in, what tools they actually use, what they've built and preserved, and who they've collaborated with. Verifiable, specific, compounding with each event.

### Profile Page: `/profile/[username]`

**Public sections:**
```
[Avatar]  [Name]  [Headline — one line, self-authored]
[.edu badge if verified]  [Domains: AI · Health · Civic]

CodePoints: 340  |  Hackathons: 8  |  Projects: 3 preserved

--- Domain Focus ---
Most active in: AI + Health (5 events), Civic Tech (2 events), Open (1 event)

--- Tools Used ---
[Supabase ✓]  [Next.js ✓]  [OpenAI API ✓]  [Stripe ✓]
(pulled from workspace sessions + showcase submissions)

--- Projects ---
[EquityBridge]  24h · CGU Hacks 2025 · Health domain · 2 forks
[SafeNest clone] ...

--- Events ---
CGU Hacks 2025  ·  MLH Hack  ·  Open Hack Night #3 ...

--- Collaborators ---
[Avatar]  [Avatar]  [Avatar]  (people worked with across events)
```

**Private sections (only visible to owner):**
- Bookmarked components
- Workspace session history
- Account settings

### Workspace → Profile Connection

The workspace already captures structured data that should flow directly into the profile. This is the key integration point between Phase 1 (live) and Phase 2.

**Data the workspace already has:**
- `selectedAudience` — the archetype the user identified with (student / developer / designer / expert)
- `selectedDomain` — the domain they're working in (climate, health, civic, etc.)
- `selectedSdgs` — SDGs they mapped their problem to
- Component selections from the "Patterns" panel — what they actually considered using

**How it populates the profile:**
- `selectedAudience` → seeds `profiles.role` on first workspace session
- `selectedDomain` → appended to `profiles.domains[]` array after each session
- Component selections → written to `profile_tools` table (tool_name, times_used)
- Session completion (GO! Mode reached) → triggers a CodePoints ledger entry (+10)

**Implementation note:** Workspace sessions are currently stateless (no persistence beyond localStorage). Phase 2 requires a `workspace_sessions` table to store session data server-side so it can be attributed to a profile. This is the migration that bridges Phase 1 and Phase 2.

```sql
CREATE TABLE workspace_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  audience text,
  domain text,
  sdgs text[] DEFAULT '{}',
  components_considered text[] DEFAULT '{}',
  reached_go_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

The profile page "Tools Used" section then becomes genuinely earned — not self-reported, pulled from what the user actually worked with in real sessions.

---

### Profile Setup Flow

Triggered first time user visits `/profile` after sign-in. Three steps, skippable:

1. **Your headline** — one sentence, plain text (e.g. "CGU grad student building in health + AI")
2. **Your domains** — pick up to 3 from the domain list (same ones as workspace)
3. **Your role** — Student / Developer / Designer / Domain Expert (same archetypes as workspace)

Optional: GitHub username (enables tool detection from repos), LinkedIn URL.

Everything else populates automatically from activity.

### CodePoints (Non-Transferable Reputation)

Earned by:
- Attending a hackathon on Codefest (+50 per event)
- Submitting a project to Showcase (+30)
- Project preserved and live after 6 months (+20)
- Project forked by another user (+15 per fork)
- Completing workspace session with full domain/stack selection (+10)
- Leaving a verified tool review after an event (+10)
- Helping a teammate (requires mutual confirmation) (+5)

CodePoints are **not** transferable, purchasable, or gameable by volume. Depth is rewarded over breadth — a single well-preserved project that gets forked earns more than 10 empty event check-ins. Anti-gaming: event attendance points only trigger after session clock runs 4+ hours.

CodePoints unlock:
- Access to invite-only hackathon tiers (Phase 3)
- Verified contributor badge on profile
- Priority team matching in discovery feed (Phase 3)
- Eligibility for sponsored bounty events (Phase 4)

---

## Part 2: Live Hackathon Discovery

### The Problem It Solves

Right now someone looking for a hackathon to join has to: check Devpost (organizer-focused, hard to browse), join MLH (student-gated), search Twitter, or wait for their school's mailing list. There is no live feed that shows "these events are happening or starting soon, here's how to join."

Discord is where team formation happens at most hackathons — a chaotic #find-a-team channel where people introduce themselves and hope someone responds before kickoff. This is the most friction-heavy moment in the entire participant experience and it's completely unaddressed by existing platforms.

### Events Directory: `/events`

**Page layout:**
```
[Starting Soon]  [This Week]  [Open Registration]  [Browse All]

--- Starting in 3 hours ---
[Card]  CGU Hacks Spring 2026
        Ethical AI · Online + In-person · 24h
        👥 34 registered · 16 spots left
        [Join →]

--- Open Registration ---
[Card]  Open Hack Night #7
        Any domain · Online · 6h · Community-run
        👥 8 registered · Open spots
        [Join →]

[Card]  Stacks Build Weekend
        Web3 + AI · Online · 48h · Sponsor-funded
        👥 127 registered · Waitlist open
        [Join waitlist →]
```

**Event card data:**
- Name, organizer, theme/domain
- Duration (6h / 24h / 48h / 72h)
- Format (online / in-person / hybrid)
- Participant count (live, updates in real-time via Supabase Realtime)
- Spots remaining (or waitlist status)
- Start time with live countdown
- Type badge: Official Codefest / Institutional / Community-run

**Filters:**
- Starting soon / this week / this month
- Domain (AI, Health, Civic, Open...)
- Duration
- Online only
- Open to all / .edu verified / invite only

### Event Detail Page: `/events/[slug]`

Replaces the fragmented WordPress info site + registration form that schools currently use.

```
[Hero: Event name, organizer logo, countdown timer]

About this hackathon
[Description, theme, tracks, judging criteria]

Schedule
[Timeline — kickoff, workshops, submission deadline, demo]

Resources
[Codefest component library pre-filtered to event domain]

Sponsors
[Listed with links — no hidden rankings]

Team Formation
[Looking for teammates? →]

Register / Join
[One-click with existing Codefest profile]
```

### Team Formation Board

Pre-event lightweight board. Not a chat room — structured cards.

```
Looking for teammates?

[Post a card]
  Role I need: [ Frontend / Backend / Designer / Domain Expert ]
  My domain focus: [ AI · Health · Civic... ]
  Time zone: [ PT / ET / GMT... ]
  One line about the project idea (optional)
  [Post]

--- Open Cards ---
[Priya · Designer · Health domain · PT · "maternal health app idea, need backend"]
[Nabil · Backend · Civic · GMT · "open to any idea"]
```

Cards expire at event kickoff. No DMs on-platform in Phase 2 — cards show a Discord handle or email for contact. Real-time DMs are Phase 3.

### Event Creation: `/events/create`

Three types, same form with different defaults:

**Official Codefest** (Evren creates, platform-sponsored prize):
- Internal only until Phase 3

**Institutional** (schools, universities):
- Requires verification (institutional email domain check)
- Co-branded: "CGU Hacks, powered by Codefest"
- Organizer gets dashboard: registrations, participant profiles, submission tracking, judging interface

**Community-run** (anyone with a Codefest account + 100+ CodePoints):
- Name, description, domain, duration, format, max participants
- Optional: recurrence (weekly / monthly / one-time)
- Visible in discovery feed after basic review (anti-spam)

---

## Database Additions

```sql
-- Profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  headline text,
  domains text[] DEFAULT '{}',
  role text CHECK (role IN ('student','developer','designer','expert')),
  github_username text,
  linkedin_url text,
  code_points integer DEFAULT 0,
  is_edu boolean DEFAULT false,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tools used (populated from workspace sessions + showcase)
CREATE TABLE profile_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  times_used integer DEFAULT 1,
  last_used_at timestamptz DEFAULT now()
);

-- CodePoints ledger (append-only, auditable)
CREATE TABLE code_points_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  points integer NOT NULL,
  reason text NOT NULL,
  reference_id uuid, -- event_id, project_id, etc.
  created_at timestamptz DEFAULT now()
);

-- Events (extends existing competitions table)
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS
  type text DEFAULT 'community' CHECK (type IN ('official','institutional','community')),
  slug text UNIQUE,
  domain text,
  duration_hours integer,
  format text CHECK (format IN ('online','in_person','hybrid')),
  max_participants integer,
  recurrence text DEFAULT 'once' CHECK (recurrence IN ('once','weekly','monthly')),
  team_formation_open boolean DEFAULT true,
  organizer_id uuid REFERENCES profiles(id),
  is_published boolean DEFAULT false;

-- Team formation cards
CREATE TABLE team_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role_needed text,
  domains text[],
  timezone text,
  idea_note text,
  contact_handle text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Event registrations
CREATE TABLE event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES competitions(id),
  profile_id uuid REFERENCES profiles(id),
  registered_at timestamptz DEFAULT now(),
  UNIQUE(event_id, profile_id)
);

-- Collaborators (set after event, mutual opt-in)
CREATE TABLE collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_a uuid REFERENCES profiles(id),
  profile_b uuid REFERENCES profiles(id),
  event_id uuid REFERENCES competitions(id),
  confirmed_at timestamptz DEFAULT now()
);
```

---

## Page Inventory

New pages required:
- `/profile/[username]` — public profile
- `/profile` — own profile / settings (redirects to `/profile/[username]`)
- `/profile/setup` — onboarding flow (3 steps)
- `/events` — discovery directory with live counts
- `/events/[slug]` — event detail + register + team formation
- `/events/create` — event creation form

Updated pages:
- `/library` — already shows bookmarks per user; add "X tools used" count on profile
- `/workspace` — session completion triggers CodePoints + tool tracking
- `/showcase/submit` — project submission triggers CodePoints

---

## Build Order Within Phase 2

1. **Profile schema + `/profile/setup`** — database first, then onboarding
2. **`/profile/[username]`** — public page (static sections first, dynamic data second)
3. **CodePoints ledger** — wire up to existing events (showcase submit, workspace session)
4. **Events directory** — `/events` with static data first, then Supabase Realtime counts
5. **Event detail + registration** — `/events/[slug]`
6. **Team formation board** — last, simplest to defer if needed

---

## The CGU Pitch Readiness Checklist

Before walking into CGU:
- [ ] Profile page live with at least 10 real profiles (seed with EquityBridge team + pilot users)
- [ ] Event detail page demo'd with a fake CGU Hacks event
- [ ] Organizer dashboard stub (registration list, participant profiles viewable)
- [ ] Component library pre-filtered to ethical AI domain
- [ ] One preserved project in Showcase from a real hackathon

When those five things exist, the pitch becomes: "Here's a live demo. Your participants get a profile that compounds across every hackathon they attend. You get a registration dashboard, real-time participant data, and a component library that makes your participants more productive during the event."

---

*Next: PHASE4_SPEC.md (Bounty Pools + Sponsorship + Crypto)*
