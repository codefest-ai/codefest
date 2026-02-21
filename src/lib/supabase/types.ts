// ── COMPETITIONS ──────────────────────────────────────────────

export type Competition = {
  id: string
  name: string
  description: string | null
  location: string | null          // "MIT · Cambridge MA" or "Online"
  website_url: string | null
  start_time: string               // ISO timestamp
  end_time: string                 // ISO timestamp
  tracks: string[]                 // e.g. ["Climate", "Health", "Open"]
  prize_pool: string | null        // e.g. "$10,000"
  max_team_size: number
  created_by: string
  created_at: string
}

export type Registration = {
  id: string
  competition_id: string
  team_id: string
  track: string | null
  clocked_in_at: string | null
  clocked_out_at: string | null
  created_at: string
  team?: {
    name: string
    description: string | null
    member_count?: number
  }
}

// ── TEAMS ─────────────────────────────────────────────────────

export type Team = {
  id: string
  name: string
  description: string | null
  hackathon_name: string | null
  invite_code: string
  created_by: string
  created_at: string
}

export type TeamRole = "Lead" | "Frontend" | "Backend" | "AI/ML" | "Design" | "Pitch" | "Member"

export type TeamMember = {
  id: string
  team_id: string
  user_id: string
  role: TeamRole
  joined_at: string
  profile?: {
    full_name: string | null
    avatar_url: string | null
    email: string
    is_edu: boolean
  }
}

export type TeamWithMembers = Team & {
  members: TeamMember[]
  member_count: number
}

// ── PROJECTS ──────────────────────────────────────────────────

export type Project = {
  id: string
  team_id: string
  name: string
  description: string | null
  domain: string | null
  github_url: string | null
  stack: string[]        // component names from the library
  sdgs: string[]         // SDG names selected
  created_at: string
  updated_at: string
}

export type TaskStatus = "backlog" | "in_progress" | "review" | "done"

export type Task = {
  id: string
  project_id: string
  team_id: string
  title: string
  description: string | null
  status: TaskStatus
  assignee_id: string | null
  position: number
  created_by: string
  created_at: string
  assignee?: {
    full_name: string | null
    avatar_url: string | null
    email: string
  }
}

// ── PROFILES ──────────────────────────────────────────────────

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_edu: boolean
  created_at: string
  updated_at: string
}

export type BookmarkRow = {
  id: string
  user_id: string
  component_name: string
  created_at: string
}

// Database schema for Supabase SQL editor
// Run this in your Supabase SQL editor to create the tables:
/*
-- Profiles table (auto-populated on auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_edu BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, is_edu)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email LIKE '%.edu'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bookmarks table
CREATE TABLE public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  component_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, component_name)
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Bookmark policies
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- ── PHASE 2: Teams schema ──────────────────────────────────────
-- Run this after Phase 1 schema

-- Teams table
CREATE TABLE public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hackathon_name TEXT,
  invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Anyone can view teams (for join-by-code)
CREATE POLICY "Anyone can view teams" ON public.teams
  FOR SELECT USING (true);

-- Only authenticated users can create teams
CREATE POLICY "Authenticated users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only creator can update their team
CREATE POLICY "Creator can update team" ON public.teams
  FOR UPDATE USING (auth.uid() = created_by);

-- Only creator can delete their team
CREATE POLICY "Creator can delete team" ON public.teams
  FOR DELETE USING (auth.uid() = created_by);

-- Team members table
CREATE TABLE public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'Member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view team members
CREATE POLICY "Anyone can view team members" ON public.team_members
  FOR SELECT USING (true);

-- Authenticated users can join teams
CREATE POLICY "Authenticated users can join teams" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Members can update their own role
CREATE POLICY "Members can update own role" ON public.team_members
  FOR UPDATE USING (auth.uid() = user_id);

-- Members can leave (delete own membership)
CREATE POLICY "Members can leave teams" ON public.team_members
  FOR DELETE USING (auth.uid() = user_id);

-- ── PHASE 3: Projects + Tasks schema ──────────────────────────
-- Run this after Phase 2 schema

-- Projects table (one per team)
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  domain TEXT,
  github_url TEXT,
  stack TEXT[] DEFAULT '{}',
  sdgs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Team members can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = projects.team_id AND user_id = auth.uid()
    )
  );

-- Tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog',
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks" ON public.tasks
  FOR SELECT USING (true);
CREATE POLICY "Team members can create tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Team members can update tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Task creator can delete" ON public.tasks
  FOR DELETE USING (auth.uid() = created_by);

-- ── PHASE 4: Competitions + Registrations schema ───────────────
-- Run after Phase 3 schema

CREATE TABLE public.competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  website_url TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  tracks TEXT[] DEFAULT '{}',
  prize_pool TEXT,
  max_team_size INTEGER DEFAULT 5,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view competitions" ON public.competitions
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create competitions" ON public.competitions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Creator can update competition" ON public.competitions
  FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creator can delete competition" ON public.competitions
  FOR DELETE USING (auth.uid() = created_by);

CREATE TABLE public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  track TEXT,
  clocked_in_at TIMESTAMPTZ,
  clocked_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(competition_id, team_id)
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view registrations" ON public.registrations
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can register" ON public.registrations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Team members can update registration" ON public.registrations
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Team members can unregister" ON public.registrations
  FOR DELETE USING (auth.uid() IS NOT NULL);
*/
