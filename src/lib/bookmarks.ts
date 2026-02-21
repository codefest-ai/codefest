import { createClient } from "@/lib/supabase/client"

export async function getBookmarks(): Promise<Set<string>> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Set()

  const { data } = await supabase
    .from("bookmarks")
    .select("component_name")
    .eq("user_id", user.id)

  return new Set((data || []).map((b) => b.component_name))
}

export async function addBookmark(componentName: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: user.id, component_name: componentName })

  return !error
}

export async function removeBookmark(componentName: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("component_name", componentName)

  return !error
}
