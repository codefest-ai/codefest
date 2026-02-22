"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/Header"
import { getProfileByUsername, getProfileTools, type Profile, type ProfileTool } from "@/lib/profiles"
import { useAuth } from "@/components/AuthProvider"
import { GraduationCap, ExternalLink, Zap } from "lucide-react"

const ROLE_META: Record<string, { icon: string; label: string }> = {
  student: { icon: "🎓", label: "Student / First-timer" },
  developer: { icon: "💻", label: "Developer" },
  designer: { icon: "🎨", label: "Designer" },
  expert: { icon: "🏥", label: "Domain Expert" },
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tools, setTools] = useState<ProfileTool[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const isOwnProfile = user && profile && user.id === profile.id

  useEffect(() => {
    if (!username) return
    getProfileByUsername(username).then(p => {
      if (!p) { setNotFound(true); setLoading(false); return }
      setProfile(p)
      getProfileTools(p.id).then(setTools)
      setLoading(false)
    })
  }, [username])

  if (loading) return (
    <div className="min-h-screen bg-surface-0">
      <Header />
      <div className="flex items-center justify-center pt-40">
        <div className="h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-surface-0">
      <Header />
      <div className="flex flex-col items-center justify-center pt-40 text-center px-6">
        <div className="text-4xl mb-4">👤</div>
        <h1 className="text-xl font-bold mb-2">Profile not found</h1>
        <p className="text-zinc-500 text-sm mb-6">@{username} doesn't exist or their profile is private.</p>
        <Link href="/library" className="text-brand-400 text-sm hover:text-brand-300 transition-colors">
          Browse the library →
        </Link>
      </div>
    </div>
  )

  if (!profile) return null

  const roleMeta = profile.role ? ROLE_META[profile.role] : null
  const joinYear = new Date(profile.created_at).getFullYear()

  return (
    <div className="min-h-screen bg-surface-0">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-2xl">

          {/* Identity */}
          <div className="mb-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight">@{profile.username}</h1>
                  {profile.is_edu && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-400 bg-brand-500/10 rounded-full px-2 py-0.5">
                      <GraduationCap className="h-2.5 w-2.5" />
                      .edu
                    </span>
                  )}
                </div>
                {profile.headline && (
                  <p className="text-zinc-400 text-sm mb-2">{profile.headline}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-600 font-mono">
                  {roleMeta && <span>{roleMeta.icon} {roleMeta.label}</span>}
                  {roleMeta && <span>·</span>}
                  <span>Joined {joinYear}</span>
                </div>
              </div>

              {/* Avatar placeholder */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 border border-brand-500/20 text-2xl font-bold text-brand-400">
                {profile.username?.[0]?.toUpperCase() ?? "?"}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3">
              {profile.github_username && (
                <a
                  href={`https://github.com/${profile.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  <span className="font-mono text-xs">gh</span>
                  {profile.github_username}
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* CodePoints */}
          <div className="rounded-2xl border border-white/[0.06] bg-surface-1/60 p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-1">CodePoints</div>
                <div className="text-3xl font-bold tracking-tight text-brand-400">{profile.code_points}</div>
              </div>
              <Zap className="h-8 w-8 text-brand-500/30" />
            </div>
          </div>

          {/* Domains */}
          {profile.domains && profile.domains.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-3">Domain Focus</div>
              <div className="flex flex-wrap gap-2">
                {profile.domains.map(domain => (
                  <span
                    key={domain}
                    className="rounded-lg bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 text-xs font-medium text-brand-400"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools Used */}
          {tools.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-3">Tools Used</div>
              <div className="flex flex-wrap gap-2">
                {tools.map(tool => (
                  <Link
                    key={tool.tool_name}
                    href={`/library/${tool.tool_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="rounded-lg bg-surface-2 border border-white/[0.06] px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-white/[0.12] transition-all"
                  >
                    {tool.tool_name}
                    {tool.times_used > 1 && (
                      <span className="ml-1.5 text-zinc-600">×{tool.times_used}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state for own profile */}
          {tools.length === 0 && isOwnProfile && (
            <div className="rounded-2xl border border-dashed border-white/[0.08] p-6 mb-6 text-center">
              <p className="text-zinc-600 text-sm mb-3">Tools you use in the workspace will appear here.</p>
              <Link
                href="/workspace"
                className="text-brand-400 text-sm hover:text-brand-300 transition-colors"
              >
                Open workspace →
              </Link>
            </div>
          )}

          {/* Edit profile CTA for own profile */}
          {isOwnProfile && (
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 font-mono">This is your profile</span>
                <button className="text-xs text-zinc-500 hover:text-white transition-colors">
                  Edit profile
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
