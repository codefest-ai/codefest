import { createClient } from "@/lib/supabase/client"

// ── Types ──────────────────────────────────────────────────────

export type ShowcaseProject = {
  id: string
  title: string
  description: string
  hackathon_name: string
  hackathon_year: number | null
  domain: string | null
  sdgs: string[]
  stack: string[]           // component names from the library
  devpost_url: string | null
  github_url: string | null
  demo_url: string | null
  lesson: string | null     // one key lesson learned
  award: string | null      // e.g. "1st Place – Climate Track"
  submitted_by: string      // user id
  submitted_at: string
  // joined
  profile?: {
    full_name: string | null
    avatar_url: string | null
    email: string
  }
}

export type ShowcaseFormData = {
  title: string
  description: string
  hackathon_name: string
  hackathon_year: string
  domain: string
  sdgs: string[]
  stack: string[]
  devpost_url: string
  github_url: string
  demo_url: string
  lesson: string
  award: string
}

// ── Queries ────────────────────────────────────────────────────

export async function getShowcaseProjects(filters?: {
  domain?: string
  sdg?: string
  stack?: string
}): Promise<ShowcaseProject[]> {
  const supabase = createClient()
  let query = supabase
    .from("showcase_projects")
    .select(`
      *,
      profile:profiles(full_name, avatar_url, email)
    `)
    .order("submitted_at", { ascending: false })

  if (filters?.domain) query = query.eq("domain", filters.domain)
  if (filters?.sdg) query = query.contains("sdgs", [filters.sdg])
  if (filters?.stack) query = query.contains("stack", [filters.stack])

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ShowcaseProject[]
}

export async function getShowcaseProject(id: string): Promise<ShowcaseProject | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("showcase_projects")
    .select(`*, profile:profiles(full_name, avatar_url, email)`)
    .eq("id", id)
    .single()
  if (error) return null
  return data as ShowcaseProject
}

export async function submitShowcaseProject(form: ShowcaseFormData): Promise<{ id: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Must be signed in to submit a project")

  const year = form.hackathon_year ? parseInt(form.hackathon_year) : null

  const { data, error } = await supabase
    .from("showcase_projects")
    .insert({
      title: form.title.trim(),
      description: form.description.trim(),
      hackathon_name: form.hackathon_name.trim(),
      hackathon_year: year,
      domain: form.domain || null,
      sdgs: form.sdgs,
      stack: form.stack,
      devpost_url: form.devpost_url.trim() || null,
      github_url: form.github_url.trim() || null,
      demo_url: form.demo_url.trim() || null,
      lesson: form.lesson.trim() || null,
      award: form.award.trim() || null,
      submitted_by: user.id,
    })
    .select("id")
    .single()

  if (error) throw error
  return { id: data.id }
}
