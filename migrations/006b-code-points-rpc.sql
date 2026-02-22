-- Migration 006b: CodePoints increment RPC
-- Run in Supabase SQL editor after 006-profiles.sql

CREATE OR REPLACE FUNCTION increment_code_points(user_id uuid, amount integer)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET code_points = code_points + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
