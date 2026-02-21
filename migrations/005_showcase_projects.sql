-- ─────────────────────────────────────────────────────────────
-- MIGRATION 005 — Showcase Projects
-- Run AFTER migration 001 (profiles required).
-- Can be run independently of 002–004.
-- ─────────────────────────────────────────────────────────────

-- Showcase projects table
-- Projects point TO Devpost/GitHub — we add curation context.
-- "Curate and Link, Don't Host" applied to the Preservation Layer.

CREATE TABLE public.showcase_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  hackathon_name TEXT NOT NULL,
  hackathon_year INTEGER,
  domain TEXT,
  sdgs TEXT[] DEFAULT '{}',
  stack TEXT[] DEFAULT '{}',          -- component names from library
  devpost_url TEXT,                   -- link to Devpost submission
  github_url TEXT,                    -- link to GitHub repo
  demo_url TEXT,                      -- link to live demo / video
  lesson TEXT,                        -- one key lesson learned
  award TEXT,                         -- e.g. "1st Place – Climate Track"
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.showcase_projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view showcase projects (public discovery)
CREATE POLICY "Anyone can view showcase projects" ON public.showcase_projects
  FOR SELECT USING (true);

-- Authenticated users can submit projects
CREATE POLICY "Authenticated users can submit projects" ON public.showcase_projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Submitter can update their own entry
CREATE POLICY "Submitter can update own project" ON public.showcase_projects
  FOR UPDATE USING (auth.uid() = submitted_by);

-- Submitter can delete their own entry
CREATE POLICY "Submitter can delete own project" ON public.showcase_projects
  FOR DELETE USING (auth.uid() = submitted_by);

-- Index for common filter operations
CREATE INDEX showcase_domain_idx ON public.showcase_projects(domain);
CREATE INDEX showcase_submitted_at_idx ON public.showcase_projects(submitted_at DESC);
