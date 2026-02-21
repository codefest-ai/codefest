import { createClient } from "@/lib/supabase/client"
import type { Project, Task, TaskStatus } from "@/lib/supabase/types"

const supabase = createClient()

// ── PROJECT ───────────────────────────────────────────────────

export async function getProject(teamId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("team_id", teamId)
    .single()

  if (error) return null
  return data
}

export async function upsertProject(
  teamId: string,
  updates: Partial<Omit<Project, "id" | "team_id" | "created_at" | "updated_at">>
): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Try update first
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("team_id", teamId)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from("projects")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("team_id", teamId)
      .select()
      .single()
    if (error) return null
    return data
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        team_id: teamId,
        name: updates.name ?? "Untitled Project",
        ...updates,
      })
      .select()
      .single()
    if (error) return null
    return data
  }
}

// ── TASKS ─────────────────────────────────────────────────────

export async function getTasks(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      assignee:profiles!tasks_assignee_id_fkey(full_name, avatar_url, email)
    `)
    .eq("project_id", projectId)
    .order("position")
    .order("created_at")

  if (error) return []
  return (data ?? []) as Task[]
}

export async function createTask(
  projectId: string,
  teamId: string,
  title: string,
  status: TaskStatus = "backlog"
): Promise<Task | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get max position for this status column
  const { data: existing } = await supabase
    .from("tasks")
    .select("position")
    .eq("project_id", projectId)
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)

  const position = existing?.[0]?.position != null ? existing[0].position + 1 : 0

  const { data, error } = await supabase
    .from("tasks")
    .insert({ project_id: projectId, team_id: teamId, title, status, position, created_by: user.id })
    .select()
    .single()

  if (error) return null
  return data
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<boolean> {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)

  return !error
}

export async function updateTaskAssignee(taskId: string, assigneeId: string | null): Promise<boolean> {
  const { error } = await supabase
    .from("tasks")
    .update({ assignee_id: assigneeId })
    .eq("id", taskId)

  return !error
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)

  return !error
}
