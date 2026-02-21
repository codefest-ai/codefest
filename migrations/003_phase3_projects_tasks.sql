-- ─────────────────────────────────────────────────────────────
-- MIGRATION 003 — Phase 3: Projects + Tasks (Kanban)
-- Run AFTER migration 002.
-- ─────────────────────────────────────────────────────────────

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
