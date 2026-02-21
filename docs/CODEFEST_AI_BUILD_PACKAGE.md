# CODEFEST.AI — COMPLETE AUTONOMOUS BUILD PACKAGE
## From Zero to Platform: Everything Needed to Build

---

## PART 1: THE VISION

### One-Line Pitch
"Hackathon projects shouldn't die. Codefest.ai keeps them alive."

### Extended Pitch
Every year, thousands of hackathon projects are built to solve real problems for real communities—then abandoned when the team disbands. The repo goes stale. The people who were supposed to benefit never see the tool.

Codefest.ai is the hackathon operating system that changes this. From "GO!" to long-term impact.

### Core Value Props
1. **For Students**: Level playing field. Curated resources. No wasted first hour.
2. **For Teams**: Live collaboration, role clarity, project planning in one place.
3. **For Projects**: Don't die after demo day. Become learning repository.
4. **For Communities**: Actually receive the tools built "for" them.
5. **For Schools**: Enterprise oversight, judging, analytics.
6. **For Sponsors**: Real engagement data, not just logo placement.

---

## PART 2: ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        CODEFEST.AI                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  RESOURCE   │  │    TEAM     │  │   PROJECT   │              │
│  │   LAYER     │  │   LAYER     │  │   LAYER     │              │
│  │             │  │             │  │             │              │
│  │ • Library   │  │ • Profiles  │  │ • Planning  │              │
│  │ • Docs      │  │ • Formation │  │ • Kanban    │              │
│  │ • Winners   │  │ • Roles     │  │ • GitHub    │              │
│  │ • Search    │  │ • Comms     │  │ • Whiteboard│              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   LIVE COMPETITION LAYER                 │    │
│  │  • Clock-in  • Global dashboard  • Real-time progress   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   PRESERVATION LAYER                     │    │
│  │  • Project hosting  • Learning repo  • Fork/improve     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   ENTERPRISE LAYER                       │    │
│  │  • School dashboards  • Judging  • Analytics  • Billing │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## PART 3: TECH STACK (Optimized for Speed)

### Frontend
```
Framework:      Next.js 14 (App Router)
Styling:        Tailwind CSS
Components:     shadcn/ui (copy-paste, no dependency hell)
State:          Zustand (simple, fast)
Real-time:      Socket.io or Supabase Realtime
```

### Backend
```
API:            Next.js API routes (start simple)
Database:       Supabase (Postgres + Auth + Realtime + Storage)
Auth:           Supabase Auth (Google OAuth built-in, .edu detection)
Search:         Supabase full-text or Algolia (later)
```

### Infrastructure
```
Hosting:        Vercel (free tier to start, scales)
Domain:         codefest.ai
CDN:            Vercel Edge (automatic)
Storage:        Supabase Storage (project files, images)
```

### Integrations
```
GitHub:         GitHub OAuth + API (repos, commits, PRs)
Whiteboard:     Excalidraw (open source, embeddable)
Kanban:         Custom build (simpler than integrating)
Comms:          Start with built-in chat, Discord webhook later
AI:             Claude API for brainstorm/search assist
```

### Why This Stack
- **Supabase**: One service for DB, auth, real-time, storage. Free tier generous.
- **Next.js + Vercel**: Deploy in minutes. Edge functions. No DevOps.
- **shadcn/ui**: Beautiful components, no npm dependency, just copy code.
- **Excalidraw**: Drop-in whiteboard, MIT licensed, battle-tested.

---

## PART 4: DATABASE SCHEMA

```sql
-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  avatar_url text,
  is_edu boolean default false,
  edu_domain text,
  github_username text,
  skills text[], -- ['frontend', 'backend', 'ai-ml', 'design', 'pitch']
  timezone text,
  created_at timestamp default now()
);

-- TEAMS
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  competition_id uuid references competitions(id),
  created_by uuid references users(id),
  created_at timestamp default now(),
  clocked_in_at timestamp,
  status text default 'forming' -- forming, active, submitted, archived
);

-- TEAM MEMBERS
create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references users(id),
  role text, -- 'lead', 'frontend', 'backend', 'ai-ml', 'design', 'pitch'
  joined_at timestamp default now()
);

-- COMPETITIONS
create table competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  organization_id uuid references organizations(id),
  starts_at timestamp,
  ends_at timestamp,
  theme text,
  rules text,
  is_public boolean default true,
  created_at timestamp default now()
);

-- ORGANIZATIONS (Schools, Companies)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text, -- 'school', 'company', 'nonprofit'
  domain text,
  logo_url text,
  plan text default 'free', -- 'free', 'enterprise'
  created_at timestamp default now()
);

-- PROJECTS
create table projects (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id),
  name text not null,
  description text,
  problem_statement text,
  target_beneficiary text,
  github_repo text,
  demo_url text,
  pitch_deck_url text,
  video_url text,
  status text default 'in-progress', -- in-progress, submitted, winner, archived
  components uuid[], -- references to components used
  created_at timestamp default now(),
  submitted_at timestamp
);

-- COMPONENTS (Resource Library)
create table components (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text, -- 'auth', 'payments', 'ai', 'database', 'ui', 'api'
  github_url text,
  docs_url text,
  npm_package text,
  logo_url text,
  setup_time_minutes int,
  difficulty text, -- 'beginner', 'intermediate', 'advanced'
  tags text[],
  is_sponsored boolean default false,
  sponsor_id uuid references organizations(id),
  created_at timestamp default now()
);

-- WINNING PROJECTS (Curated showcase)
create table showcases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  competition_name text,
  competition_date date,
  placement text, -- '1st', '2nd', '3rd', 'category-winner', 'honorable'
  breakdown text, -- markdown explaining how they built it
  components_used uuid[],
  lessons_learned text,
  team_size int,
  build_time_hours int,
  featured boolean default false,
  created_at timestamp default now()
);

-- TASKS (Kanban)
create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  status text default 'todo', -- 'todo', 'in-progress', 'review', 'done'
  assigned_to uuid references users(id),
  role text, -- which role this task belongs to
  priority int default 0,
  created_at timestamp default now(),
  completed_at timestamp
);

-- BOOKMARKS (User's saved resources)
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  component_id uuid references components(id),
  notes text,
  created_at timestamp default now()
);

-- MESSAGES (Team chat)
create table messages (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references users(id),
  content text not null,
  created_at timestamp default now()
);
```

---

## PART 5: FOLDER STRUCTURE

```
codefest-ai/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── callback/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home dashboard
│   │   ├── library/
│   │   │   ├── page.tsx                # Component library
│   │   │   └── [id]/page.tsx           # Component detail
│   │   ├── showcase/
│   │   │   ├── page.tsx                # Winning projects
│   │   │   └── [id]/page.tsx           # Project breakdown
│   │   ├── teams/
│   │   │   ├── page.tsx                # My teams
│   │   │   ├── new/page.tsx            # Create team
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Team dashboard
│   │   │       ├── kanban/page.tsx     # Kanban board
│   │   │       ├── whiteboard/page.tsx # Excalidraw embed
│   │   │       ├── chat/page.tsx       # Team chat
│   │   │       └── settings/page.tsx   # Team settings
│   │   ├── competitions/
│   │   │   ├── page.tsx                # Live competitions
│   │   │   └── [id]/page.tsx           # Competition detail
│   │   ├── profile/
│   │   │   └── page.tsx                # User profile
│   │   └── bookmarks/
│   │       └── page.tsx                # Saved components
│   ├── (marketing)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── about/page.tsx
│   │   └── pricing/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   ├── components/
│   │   │   └── route.ts
│   │   ├── teams/
│   │   │   └── route.ts
│   │   ├── projects/
│   │   │   └── route.ts
│   │   ├── tasks/
│   │   │   └── route.ts
│   │   ├── github/
│   │   │   └── route.ts
│   │   └── ai/
│   │       └── route.ts                # Claude integration
│   └── layout.tsx
├── components/
│   ├── ui/                             # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── library/
│   │   ├── ComponentCard.tsx
│   │   ├── ComponentSearch.tsx
│   │   └── ComponentFilter.tsx
│   ├── teams/
│   │   ├── TeamCard.tsx
│   │   ├── RoleSelector.tsx
│   │   └── MemberList.tsx
│   ├── kanban/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── TaskCard.tsx
│   ├── competitions/
│   │   ├── LiveDashboard.tsx
│   │   ├── CompetitionCard.tsx
│   │   └── ClockInButton.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Avatar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── github.ts
│   ├── ai.ts
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   ├── useTeam.ts
│   ├── useRealtime.ts
│   └── useComponents.ts
├── store/
│   └── index.ts                        # Zustand store
├── types/
│   └── index.ts                        # TypeScript types
├── public/
│   ├── logo.svg
│   └── ...
├── .env.local
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## PART 6: RALPH-STYLE BUILD PLAN

### How to Use This
Each phase has tasks broken into <5 minute chunks with clear acceptance criteria.
Run these through Claude Code with Ralph pattern: loop until done, fresh context each iteration.

### PHASE 1: Foundation (Weekend 1)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 1

branchName: phase-1-foundation

userStories:
  - id: 1.1
    title: "Initialize Next.js project"
    acceptance:
      - Next.js 14 app router project created
      - Tailwind CSS configured
      - TypeScript enabled
      - Runs on localhost:3000
    passes: false
    
  - id: 1.2
    title: "Set up Supabase connection"
    acceptance:
      - Supabase project created
      - Environment variables configured
      - Client and server helpers created in lib/supabase/
      - Connection test passes
    passes: false
    
  - id: 1.3
    title: "Implement Google OAuth"
    acceptance:
      - Login page at /login
      - Google OAuth button works
      - Redirects to /callback after auth
      - User created in users table
      - .edu email detection sets is_edu flag
    passes: false
    
  - id: 1.4
    title: "Create base layout"
    acceptance:
      - Header with logo and user menu
      - Sidebar navigation (Library, Teams, Competitions, Bookmarks)
      - Responsive on mobile
      - Dark mode support
    passes: false
    
  - id: 1.5
    title: "Set up database schema"
    acceptance:
      - All tables from schema created in Supabase
      - Row level security policies enabled
      - Users can only see their own bookmarks
      - Team members can see their team's data
    passes: false
```

### PHASE 2: Component Library (Weekend 2)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 2

branchName: phase-2-library

userStories:
  - id: 2.1
    title: "Create components table seed data"
    acceptance:
      - 50+ components seeded across categories
      - Categories: auth, payments, ai, database, ui, api, devtools
      - Each has: name, description, github_url, docs_url, setup_time, difficulty
    passes: false
    
  - id: 2.2
    title: "Build component library page"
    acceptance:
      - Grid of ComponentCard components
      - Shows name, category, difficulty, setup time
      - Clicking opens detail modal or page
    passes: false
    
  - id: 2.3
    title: "Add search and filter"
    acceptance:
      - Search bar filters by name and description
      - Category filter dropdown
      - Difficulty filter
      - Setup time filter (< 15min, < 30min, < 1hr)
    passes: false
    
  - id: 2.4
    title: "Implement bookmarking"
    acceptance:
      - Bookmark button on each component
      - Saves to bookmarks table
      - Bookmarks page shows all saved
      - Can remove bookmark
    passes: false
    
  - id: 2.5
    title: "Component detail page"
    acceptance:
      - Full description
      - Setup instructions (markdown rendered)
      - Link to docs, GitHub
      - Related components
      - "Projects using this" section (empty for now)
    passes: false
```

### PHASE 3: Showcase/Winners (Week 2)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 3

branchName: phase-3-showcase

userStories:
  - id: 3.1
    title: "Create showcase seed data"
    acceptance:
      - 20+ winning projects added
      - Each has: competition name, date, placement, breakdown
      - Components used linked
      - Realistic data from real hackathons
    passes: false
    
  - id: 3.2
    title: "Build showcase listing page"
    acceptance:
      - Grid of winning project cards
      - Shows: name, competition, placement, component count
      - Filter by category/year
    passes: false
    
  - id: 3.3
    title: "Build showcase detail page"
    acceptance:
      - Full project breakdown (markdown)
      - "Shop the look" component list
      - Each component links to library
      - GitHub repo link
      - Demo link if available
    passes: false
    
  - id: 3.4
    title: "Add 'Fork this project' concept"
    acceptance:
      - Button to "Start from this template"
      - Creates new project with same components pre-selected
      - Links to GitHub template if available
    passes: false
```

### PHASE 4: Teams & Profiles (Week 3)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 4

branchName: phase-4-teams

userStories:
  - id: 4.1
    title: "Build user profile page"
    acceptance:
      - Shows name, avatar, skills
      - Edit profile modal
      - GitHub connection
      - List of teams
    passes: false
    
  - id: 4.2
    title: "Create team flow"
    acceptance:
      - "Create Team" button
      - Name, description form
      - Creator becomes team lead
      - Team page created
    passes: false
    
  - id: 4.3
    title: "Team invitation system"
    acceptance:
      - Generate invite link
      - Invite link joins user to team
      - Can set role on join
      - Team lead can remove members
    passes: false
    
  - id: 4.4
    title: "Role assignment UI"
    acceptance:
      - Role selector for each member
      - Roles: Lead, Frontend, Backend, AI/ML, Design, Pitch
      - Visual indicators on team page
      - Can change own role
    passes: false
    
  - id: 4.5
    title: "Team dashboard"
    acceptance:
      - Overview of team status
      - Member list with roles
      - Quick links to kanban, whiteboard, chat
      - Project summary if exists
    passes: false
```

### PHASE 5: Project Planning (Week 4)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 5

branchName: phase-5-planning

userStories:
  - id: 5.1
    title: "Project creation flow"
    acceptance:
      - Create project from team page
      - Name, description, problem statement
      - Target beneficiary field
      - Linked to team
    passes: false
    
  - id: 5.2
    title: "Component selection for project"
    acceptance:
      - Browse library from project page
      - Add components to project
      - Shows selected components list
      - Quick access to docs
    passes: false
    
  - id: 5.3
    title: "Kanban board"
    acceptance:
      - Columns: Todo, In Progress, Review, Done
      - Drag and drop tasks
      - Create task modal
      - Assign to team member
      - Filter by role
    passes: false
    
  - id: 5.4
    title: "Real-time kanban updates"
    acceptance:
      - Supabase realtime subscription
      - Changes reflect instantly for all team members
      - Optimistic updates for smooth UX
    passes: false
    
  - id: 5.5
    title: "Whiteboard integration"
    acceptance:
      - Excalidraw embedded in iframe
      - Collaborative (multiple users)
      - State persisted to Supabase storage
      - Load/save functionality
    passes: false
```

### PHASE 6: GitHub Integration (Week 5)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 6

branchName: phase-6-github

userStories:
  - id: 6.1
    title: "GitHub OAuth"
    acceptance:
      - Connect GitHub account from profile
      - Store access token securely
      - Show connection status
    passes: false
    
  - id: 6.2
    title: "Link repo to project"
    acceptance:
      - Select from user's repos
      - Or paste repo URL
      - Store github_repo on project
    passes: false
    
  - id: 6.3
    title: "Display recent commits"
    acceptance:
      - Fetch commits via GitHub API
      - Show on project page
      - Update periodically
    passes: false
    
  - id: 6.4
    title: "Auto-link commits to tasks"
    acceptance:
      - Parse commit messages for task IDs
      - Show linked commits on task card
      - Optional: auto-move task on commit
    passes: false
```

### PHASE 7: Live Competitions (Week 6)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 7

branchName: phase-7-competitions

userStories:
  - id: 7.1
    title: "Competition listing page"
    acceptance:
      - Shows upcoming and active competitions
      - Filter by date, public/private
      - Search by name
    passes: false
    
  - id: 7.2
    title: "Competition detail page"
    acceptance:
      - Name, description, rules, theme
      - Start/end times with countdown
      - List of participating teams (if public)
    passes: false
    
  - id: 7.3
    title: "Clock-in functionality"
    acceptance:
      - "Clock In" button on team
      - Sets clocked_in_at timestamp
      - Shows elapsed time
      - Team appears on live dashboard
    passes: false
    
  - id: 7.4
    title: "Live dashboard"
    acceptance:
      - Global view of active competitions
      - Count of teams currently clocked in
      - Map visualization (optional)
      - Real-time updates via Supabase
    passes: false
```

### PHASE 8: Team Chat (Week 7)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 8

branchName: phase-8-chat

userStories:
  - id: 8.1
    title: "Basic chat UI"
    acceptance:
      - Message list
      - Input field
      - Send button
      - Shows sender name and avatar
    passes: false
    
  - id: 8.2
    title: "Real-time messaging"
    acceptance:
      - Supabase realtime subscription
      - New messages appear instantly
      - Scroll to bottom on new message
    passes: false
    
  - id: 8.3
    title: "Message persistence"
    acceptance:
      - Messages saved to messages table
      - Load history on page open
      - Pagination for old messages
    passes: false
```

### PHASE 9: AI Features (Week 8)

```markdown
## IMPLEMENTATION_PLAN.md - Phase 9

branchName: phase-9-ai

userStories:
  - id: 9.1
    title: "AI search for components"
    acceptance:
      - Natural language search
      - "I need authentication with social login"
      - Returns relevant components
    passes: false
    
  - id: 9.2
    title: "Project brainstorm assistant"
    acceptance:
      - Input hackathon theme
      - AI suggests project ideas
      - Can refine with follow-ups
    passes: false
    
  - id: 9.3
    title: "Architecture suggester"
    acceptance:
      - Based on project description
      - Suggests component stack
      - One-click add all to project
    passes: false
```

---

## PART 7: COMPONENT LIBRARY SEED DATA

See `src/data/components_seed.json` for the full 50-component dataset.

---

## PART 8: ENV VARIABLES

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI
ANTHROPIC_API_KEY=your-anthropic-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## PART 9: KEY COMMANDS

```bash
# Initialize project
npx create-next-app@latest codefest-ai --typescript --tailwind --app --src-dir=false

# Add shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog dropdown-menu avatar

# Add dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zustand

# Add dev dependencies
npm install -D @types/node

# Run dev server
npm run dev

# Supabase CLI (optional, for local dev)
npx supabase init
npx supabase start
```

---

## PART 10: LANDING PAGE COPY

```markdown
# Codefest.ai

## Hackathon projects shouldn't die.

Every year, thousands of projects are built to solve real problems—then abandoned when the team disbands.

**Codefest.ai keeps them alive.**

---

### For Teams

**Clock in. Build together. Ship.**

- Curated component library (stop wasting the first hour)
- Role-based kanban (everyone knows their lane)
- Live whiteboard (brainstorm in real-time)
- GitHub integration (commits show up automatically)

### For Projects

**Your work lives on.**

- Hosted forever (not just until the repo goes stale)
- Becomes a learning resource for others
- Communities you built for can actually use it
- Others can fork and improve

### For Schools

**Run better hackathons.**

- Dashboard for all your teams
- Built-in judging interface
- Analytics on participation
- No more third-party tool chaos

---

### Free for students.

Just sign in with your .edu email.

[Get Started →]

---

### "Everyone open Codefest."

That's the goal. When the clock starts, you're already building.
```

---

## PART 11: ISLAMIC COMPLIANCE NOTES

### Allowed Revenue Streams
- ✅ Subscription fees (direct payment for service)
- ✅ One-time payments (pay-what-you-can model)
- ✅ Enterprise licensing
- ✅ Sponsorships (advertising/visibility)
- ✅ Donations

### Prohibited
- ❌ Interest-based financing
- ❌ Gambling mechanics (random rewards, loot boxes)
- ❌ Alcohol/haram product sponsors

### Implementation
- Use Stripe or LemonSqueezy for payments (no interest)
- Sponsor vetting process (no haram industries)
- Clear value exchange (not extractive)

---

## PART 12: FUTURE VISION

### Phase 10+: The Platform Students Build On

Once the infrastructure is stable:

1. **Integrated IDE**
   - Code directly in Codefest.ai
   - No local setup required
   - Components auto-import

2. **Real-time Collaboration**
   - Multiple cursors in code
   - Voice/video optional
   - Pair programming built-in

3. **Deployment**
   - One-click deploy to Vercel/Netlify
   - Demo URL generated automatically
   - Judges can see live app

4. **AI Coding Assistant**
   - Contextual to your stack
   - Knows your team's code
   - Suggests based on component docs

### Gradate Integration

Eventually, Codefest.ai becomes:
- An entry point into the Gradate ecosystem
- Demonstrates coordination infrastructure in action
- Real-world testing ground for Throughline patterns

**"Codefest.ai — powered by Gradate"**

---

## PART 13: IMMEDIATE NEXT STEPS

1. **Buy domain**: codefest.ai (do this now)
2. **Create Supabase project**: Free tier
3. **Initialize Next.js**: Run the commands
4. **Set up Ralph workflow**: Create IMPLEMENTATION_PLAN.md with Phase 1
5. **Start looping**: Let Claude Code run through Phase 1 tasks

---

*Build package created: January 15, 2026*
*Ready for autonomous execution*
