-- ============================================================
-- CODEFEST.AI — FULL SUPABASE MIGRATION
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- Run sections in order. Each section is safe to re-run.
-- ============================================================


-- ── 1. PROFILES ──────────────────────────────────────────────
-- Core user profile. Created by user on first sign-in via /profile/setup.
-- is_edu and school_domain are derived from the user's email at creation time.

CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username        TEXT        UNIQUE,
  headline        TEXT,
  domains         TEXT[]      DEFAULT '{}',
  role            TEXT,
  github_username TEXT,
  linkedin_url    TEXT,
  code_points     INTEGER     DEFAULT 0,
  is_edu          BOOLEAN     DEFAULT false,
  is_public       BOOLEAN     DEFAULT true,
  school_domain   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON public.profiles;

-- Anyone can view public profiles
CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);


-- ── 2. BOOKMARKS ─────────────────────────────────────────────
-- Saved components. One row per (user, component_name) pair.

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  component_name TEXT        NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, component_name)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookmarks_select" ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks_insert" ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks_delete" ON public.bookmarks;

CREATE POLICY "bookmarks_select" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_insert" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_delete" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);


-- ── 3. PROFILE TOOLS ─────────────────────────────────────────
-- Tracks which components a user has used and how often.
-- Drives the "tools I've used" section on profiles.

CREATE TABLE IF NOT EXISTS public.profile_tools (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id   UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tool_name    TEXT        NOT NULL,
  times_used   INTEGER     DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, tool_name)
);

ALTER TABLE public.profile_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile_tools_select" ON public.profile_tools;
DROP POLICY IF EXISTS "profile_tools_insert" ON public.profile_tools;
DROP POLICY IF EXISTS "profile_tools_update" ON public.profile_tools;

CREATE POLICY "profile_tools_select" ON public.profile_tools
  FOR SELECT USING (true);

CREATE POLICY "profile_tools_insert" ON public.profile_tools
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "profile_tools_update" ON public.profile_tools
  FOR UPDATE USING (auth.uid() = profile_id);


-- ── 4. WORKSPACE SESSIONS ────────────────────────────────────
-- Logs completed workspace runs. Drives CodePoints and analytics.

CREATE TABLE IF NOT EXISTS public.workspace_sessions (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id            UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  audience              TEXT,
  domain                TEXT,
  sdgs                  TEXT[]      DEFAULT '{}',
  components_considered TEXT[]      DEFAULT '{}',
  reached_go_mode       BOOLEAN     DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.workspace_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "workspace_sessions_select" ON public.workspace_sessions;
DROP POLICY IF EXISTS "workspace_sessions_insert" ON public.workspace_sessions;

CREATE POLICY "workspace_sessions_select" ON public.workspace_sessions
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "workspace_sessions_insert" ON public.workspace_sessions
  FOR INSERT WITH CHECK (auth.uid() = profile_id);


-- ── 5. CODE POINTS LEDGER ────────────────────────────────────
-- Append-only log of every CodePoint event. Source of truth.
-- profiles.code_points is a denormalized total (for fast reads).

CREATE TABLE IF NOT EXISTS public.code_points_ledger (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id   UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  points       INTEGER     NOT NULL,
  reason       TEXT        NOT NULL,
  reference_id TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.code_points_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ledger_select" ON public.code_points_ledger;
DROP POLICY IF EXISTS "ledger_insert" ON public.code_points_ledger;

CREATE POLICY "ledger_select" ON public.code_points_ledger
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "ledger_insert" ON public.code_points_ledger
  FOR INSERT WITH CHECK (auth.uid() = profile_id);


-- ── 6. FUNCTIONS ─────────────────────────────────────────────

-- Count how many users belong to a given school domain.
-- Used on the profile page: "You're the 4th person from CGU!"
CREATE OR REPLACE FUNCTION public.get_school_count(domain_input TEXT)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.profiles
  WHERE school_domain = domain_input;
$$;

-- Increment a user's code_points total.
-- Called from client-side after adding a ledger row.
CREATE OR REPLACE FUNCTION public.increment_code_points(user_id UUID, amount INTEGER)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.profiles
  SET code_points = code_points + amount
  WHERE id = user_id;
$$;


-- ── 7. PERFORMANCE INDEXES ───────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id
  ON public.bookmarks(user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_username
  ON public.profiles(username);

CREATE INDEX IF NOT EXISTS idx_profiles_school_domain
  ON public.profiles(school_domain)
  WHERE school_domain IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_workspace_sessions_profile
  ON public.workspace_sessions(profile_id);

CREATE INDEX IF NOT EXISTS idx_ledger_profile
  ON public.code_points_ledger(profile_id);


-- ── DONE ─────────────────────────────────────────────────────
-- Expected result: 5 new tables, 2 new functions, 5 indexes.
-- No Phase 2 tables (teams, competitions, projects) — those come later.
-- ─────────────────────────────────────────────────────────────
