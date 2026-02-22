-- Migration 006: Profiles + CodePoints + Workspace Sessions
-- Run in Supabase SQL editor

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  headline text,
  domains text[] DEFAULT '{}',
  role text CHECK (role IN ('student','developer','designer','expert')),
  github_username text,
  linkedin_url text,
  code_points integer DEFAULT 0,
  is_edu boolean DEFAULT false,
  is_public boolean DEFAULT true,
  stacks_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tools used (populated from workspace sessions + showcase submissions)
CREATE TABLE IF NOT EXISTS profile_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  times_used integer DEFAULT 1,
  last_used_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, tool_name)
);

-- CodePoints ledger (append-only, auditable)
CREATE TABLE IF NOT EXISTS code_points_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  points integer NOT NULL,
  reason text NOT NULL,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Workspace sessions (bridges Phase 1 workspace → Phase 2 profile)
CREATE TABLE IF NOT EXISTS workspace_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  audience text,
  domain text,
  sdgs text[] DEFAULT '{}',
  components_considered text[] DEFAULT '{}',
  reached_go_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: public can read public profiles, users manage their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Profile tools: users manage their own
CREATE POLICY "Users can view their own tools"
  ON profile_tools FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own tools"
  ON profile_tools FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own tools"
  ON profile_tools FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

-- CodePoints: users can read their own ledger
CREATE POLICY "Users can view their own points"
  ON code_points_ledger FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own points"
  ON code_points_ledger FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

-- Workspace sessions: users manage their own
CREATE POLICY "Users can view their own sessions"
  ON workspace_sessions FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own sessions"
  ON workspace_sessions FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE id = auth.uid())
  );

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
