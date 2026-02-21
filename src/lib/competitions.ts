import { createClient } from "@/lib/supabase/client"
import type { Competition, Registration } from "@/lib/supabase/types"

const supabase = createClient()

// ── COMPETITIONS ──────────────────────────────────────────────

export async function getCompetitions(): Promise<Competition[]> {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("start_time", { ascending: true })

  if (error) return []
  return data ?? []
}

export async function getCompetition(id: string): Promise<Competition | null> {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function createCompetition(
  fields: Pick<Competition, "name" | "description" | "location" | "website_url" | "start_time" | "end_time" | "tracks" | "prize_pool" | "max_team_size">
): Promise<Competition | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("competitions")
    .insert({ ...fields, created_by: user.id })
    .select()
    .single()

  if (error) return null
  return data
}

// ── REGISTRATIONS ─────────────────────────────────────────────

export async function getRegistrations(competitionId: string): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select(`
      *,
      team:teams(name, description)
    `)
    .eq("competition_id", competitionId)
    .order("created_at")

  if (error) return []
  return (data ?? []) as Registration[]
}

export async function getMyRegistration(
  competitionId: string,
  teamId: string
): Promise<Registration | null> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("competition_id", competitionId)
    .eq("team_id", teamId)
    .single()

  if (error) return null
  return data
}

export async function registerTeam(
  competitionId: string,
  teamId: string,
  track: string | null
): Promise<Registration | null> {
  const { data, error } = await supabase
    .from("registrations")
    .insert({ competition_id: competitionId, team_id: teamId, track })
    .select()
    .single()

  if (error) return null
  return data
}

export async function unregisterTeam(registrationId: string): Promise<boolean> {
  const { error } = await supabase
    .from("registrations")
    .delete()
    .eq("id", registrationId)

  return !error
}

export async function clockIn(registrationId: string): Promise<boolean> {
  const { error } = await supabase
    .from("registrations")
    .update({ clocked_in_at: new Date().toISOString(), clocked_out_at: null })
    .eq("id", registrationId)

  return !error
}

export async function clockOut(registrationId: string): Promise<boolean> {
  const { error } = await supabase
    .from("registrations")
    .update({ clocked_out_at: new Date().toISOString() })
    .eq("id", registrationId)

  return !error
}

// ── HELPERS ───────────────────────────────────────────────────

export function competitionStatus(comp: Competition): "upcoming" | "live" | "ended" {
  const now = Date.now()
  const start = new Date(comp.start_time).getTime()
  const end = new Date(comp.end_time).getTime()
  if (now < start) return "upcoming"
  if (now > end) return "ended"
  return "live"
}

export function formatDuration(ms: number): string {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}
