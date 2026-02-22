import { createClient } from "@/lib/supabase/client"

export type Profile = {
  id: string
  username: string | null
  headline: string | null
  domains: string[]
  role: "student" | "developer" | "designer" | "expert" | null
  github_username: string | null
  linkedin_url: string | null
  code_points: number
  is_edu: boolean
  is_public: boolean
  school_domain: string | null
  created_at: string
}

export type ProfileTool = {
  tool_name: string
  times_used: number
  last_used_at: string
}

export async function getOwnProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data as Profile | null
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .single()

  return data as Profile | null
}

export async function getProfileTools(profileId: string): Promise<ProfileTool[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from("profile_tools")
    .select("tool_name, times_used, last_used_at")
    .eq("profile_id", profileId)
    .order("times_used", { ascending: false })
    .limit(12)

  return (data ?? []) as ProfileTool[]
}

export async function createProfile(profile: {
  username: string
  headline?: string
  domains?: string[]
  role?: string
  github_username?: string
}): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const is_edu = user.email?.endsWith(".edu") ?? false
  const school_domain = is_edu && user.email ? user.email.split("@")[1] ?? null : null

  const { error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      username: profile.username.toLowerCase().trim(),
      headline: profile.headline?.trim() || null,
      domains: profile.domains ?? [],
      role: profile.role ?? null,
      github_username: profile.github_username?.trim() || null,
      is_edu,
      school_domain,
    })

  if (error) return { error: error.message }

  // Award 10 CodePoints for creating a profile
  await addCodePoints(10, "profile_created")

  return { error: null }
}

export async function saveWorkspaceSession(data: {
  audience?: string | null
  domain?: string | null
  sdgs?: string[]
  components_considered?: string[]
  reached_go_mode?: boolean
}): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  // Only save if user has a profile
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!existing) return { error: "No profile yet" }

  const { error } = await supabase.from("workspace_sessions").insert({
    profile_id: user.id,
    audience: data.audience ?? null,
    domain: data.domain ?? null,
    sdgs: data.sdgs ?? [],
    components_considered: data.components_considered ?? [],
    reached_go_mode: data.reached_go_mode ?? false,
  })

  if (error) return { error: error.message }

  // Award 5 CodePoints for completing a workspace session
  await addCodePoints(5, "workspace_session_completed")

  return { error: null }
}

export async function updateProfile(updates: Partial<{
  headline: string
  domains: string[]
  role: string
  github_username: string
  linkedin_url: string
  is_public: boolean
}>): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not signed in" }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)

  if (error) return { error: error.message }
  return { error: null }
}

export async function getSchoolCount(schoolDomain: string): Promise<number> {
  const supabase = createClient()
  const { data } = await supabase.rpc("get_school_count", { domain_input: schoolDomain })
  return (data as number) ?? 0
}

export function schoolDisplayName(domain: string): string {
  // "cgu.edu" → "CGU", "mit.edu" → "MIT"
  return domain.split(".")[0].toUpperCase()
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.toLowerCase().trim())
    .single()

  return !data
}

export async function addCodePoints(points: number, reason: string, referenceId?: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("code_points_ledger").insert({
    profile_id: user.id,
    points,
    reason,
    reference_id: referenceId ?? null,
  })

  await supabase.rpc("increment_code_points", { user_id: user.id, amount: points })
}
