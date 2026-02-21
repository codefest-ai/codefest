# IMPLEMENTATION_PLAN.md
# Codefest.ai Phase 1: Foundation

branchName: phase-1-foundation

## Context
Building the hackathon operating system. Start with foundation: Next.js, Supabase, Auth, Layout.

## User Stories

### 1.1 Initialize Next.js Project
**priority: 1**
**estimatedMinutes: 5**

acceptance:
- [ ] Next.js 14 project created with App Router
- [ ] TypeScript enabled and strict
- [ ] Tailwind CSS configured
- [ ] ESLint configured
- [ ] Runs successfully on localhost:3000

commands:
```bash
npx create-next-app@latest codefest-ai --typescript --tailwind --eslint --app --src-dir=false
cd codefest-ai
npm run dev
```

passes: false

---

### 1.2 Add shadcn/ui Components
**priority: 2**
**estimatedMinutes: 10**

acceptance:
- [ ] shadcn/ui initialized
- [ ] Base components added: button, card, input, dialog, dropdown-menu, avatar, badge
- [ ] Components render correctly

commands:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog dropdown-menu avatar badge
```

passes: false

---

### 1.3 Create Supabase Project
**priority: 3**
**estimatedMinutes: 10**

acceptance:
- [ ] Supabase project created at supabase.com
- [ ] Project URL and anon key obtained
- [ ] .env.local created with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] @supabase/supabase-js installed

passes: false

---

### 1.4 Create Supabase Client Helpers
**priority: 4**
**estimatedMinutes: 10**

acceptance:
- [ ] lib/supabase/client.ts created for browser client
- [ ] lib/supabase/server.ts created for server components
- [ ] lib/supabase/middleware.ts created for auth middleware
- [ ] Types generated or manually created

passes: false

---

### 1.5 Set Up Database Schema
**priority: 5**
**estimatedMinutes: 15**

acceptance:
- [ ] Users table created
- [ ] Teams table created
- [ ] Team_members table created
- [ ] Components table created
- [ ] Bookmarks table created
- [ ] Row Level Security enabled on all tables

passes: false

---

### 1.6 Implement Google OAuth
**priority: 6**
**estimatedMinutes: 15**

acceptance:
- [ ] Google OAuth enabled in Supabase dashboard
- [ ] Login page created at app/(auth)/login/page.tsx
- [ ] "Sign in with Google" button works
- [ ] Callback handled at app/(auth)/callback/route.ts
- [ ] User redirected to dashboard after login

passes: false

---

### 1.7 Detect .edu Emails
**priority: 7**
**estimatedMinutes: 5**

acceptance:
- [ ] On user creation/login, check if email ends with .edu
- [ ] Set is_edu = true if .edu email

passes: false

---

### 1.8 Create Base Layout
**priority: 8**
**estimatedMinutes: 20**

acceptance:
- [ ] Header component with logo, navigation, user menu
- [ ] Sidebar with nav items: Library, Teams, Competitions, Bookmarks
- [ ] Responsive: sidebar collapses to hamburger on mobile
- [ ] Dark mode toggle working

passes: false

---

### 1.9 Create Dashboard Home Page
**priority: 9**
**estimatedMinutes: 10**

acceptance:
- [ ] Shows welcome message with user name
- [ ] Quick stats: bookmarked components count
- [ ] Protected route: redirects to /login if not authenticated

passes: false

---

### 1.10 Landing Page
**priority: 10**
**estimatedMinutes: 15**

acceptance:
- [ ] Hero section with value prop
- [ ] Features section (Library, Teams, Projects)
- [ ] CTA: "Get Started" → /login
- [ ] Responsive design

passes: false

---

## Progress Log

### Session 1 - [DATE]
- Started Phase 1
- Tasks completed: [list]
- Blockers: [list]
- Next: [next task]

## Completion

When ALL tasks have passes: true → PHASE_1_COMPLETE
