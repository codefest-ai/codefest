-- ─────────────────────────────────────────────────────────────
-- MIGRATION 004 — Phase 4: Competitions + Registrations
-- Run AFTER migration 003.
-- ─────────────────────────────────────────────────────────────

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
