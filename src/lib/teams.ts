import { createClient } from "@/lib/supabase/client"
import type { Team, TeamMember, TeamRole, TeamWithMembers } from "@/lib/supabase/types"

const supabase = createClient()

// ── CREATE ────────────────────────────────────────────────────

export async function createTeam(
  name: string,
  description: string,
  hackathonName: string
): Promise<Team | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: team, error } = await supabase
    .from("teams")
    .insert({ name, description, hackathon_name: hackathonName, created_by: user.id })
    .select()
    .single()

  if (error || !team) return null

  // Auto-join as Lead
  await supabase
    .from("team_members")
    .insert({ team_id: team.id, user_id: user.id, role: "Lead" })

  return team
}

// ── READ ──────────────────────────────────────────────────────

export async function getMyTeams(): Promise<TeamWithMembers[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get team IDs for this user
  const { data: memberships } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)

  if (!memberships?.length) return []

  const teamIds = memberships.map((m) => m.team_id)

  // Get full team data
  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .in("id", teamIds)
    .order("created_at", { ascending: false })

  if (!teams) return []

  // Get members for each team with their profiles
  const teamsWithMembers: TeamWithMembers[] = await Promise.all(
    teams.map(async (team) => {
      const { data: members } = await supabase
        .from("team_members")
        .select(`
          *,
          profile:profiles(full_name, avatar_url, email, is_edu)
        `)
        .eq("team_id", team.id)
        .order("joined_at")

      return {
        ...team,
        members: (members ?? []) as TeamMember[],
        member_count: members?.length ?? 0,
      }
    })
  )

  return teamsWithMembers
}

export async function getTeam(id: string): Promise<TeamWithMembers | null> {
  const { data: team, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !team) return null

  const { data: members } = await supabase
    .from("team_members")
    .select(`
      *,
      profile:profiles(full_name, avatar_url, email, is_edu)
    `)
    .eq("team_id", id)
    .order("joined_at")

  return {
    ...team,
    members: (members ?? []) as TeamMember[],
    member_count: members?.length ?? 0,
  }
}

export async function getTeamByInviteCode(code: string): Promise<Team | null> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("invite_code", code.toLowerCase().trim())
    .single()

  if (error) return null
  return data
}

// ── JOIN / LEAVE ──────────────────────────────────────────────

export async function joinTeamByCode(inviteCode: string): Promise<{ team: Team | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { team: null, error: "Sign in to join a team" }

  const team = await getTeamByInviteCode(inviteCode)
  if (!team) return { team: null, error: "No team found with that code" }

  // Check already a member
  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("team_id", team.id)
    .eq("user_id", user.id)
    .single()

  if (existing) return { team, error: "You're already on this team" }

  const { error } = await supabase
    .from("team_members")
    .insert({ team_id: team.id, user_id: user.id, role: "Member" })

  if (error) return { team: null, error: "Failed to join team — try again" }
  return { team, error: null }
}

export async function leaveTeam(teamId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", user.id)

  return !error
}

// ── UPDATE ────────────────────────────────────────────────────

export async function updateMyRole(teamId: string, role: TeamRole): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from("team_members")
    .update({ role })
    .eq("team_id", teamId)
    .eq("user_id", user.id)

  return !error
}

export async function updateTeam(
  teamId: string,
  updates: { name?: string; description?: string; hackathon_name?: string }
): Promise<boolean> {
  const { error } = await supabase
    .from("teams")
    .update(updates)
    .eq("id", teamId)

  return !error
}
