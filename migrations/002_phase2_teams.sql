-- ─────────────────────────────────────────────────────────────
-- MIGRATION 002 — Phase 2: Teams + Team Members
-- Run AFTER migration 001.
-- ─────────────────────────────────────────────────────────────

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

-- Anyone can view teams (needed for join-by-code flow)
CREATE POLICY "Anyone can view teams" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Creator can update team" ON public.teams
  FOR UPDATE USING (auth.uid() = created_by);

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

CREATE POLICY "Anyone can view team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join teams" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can update own role" ON public.team_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Members can leave teams" ON public.team_members
  FOR DELETE USING (auth.uid() = user_id);
