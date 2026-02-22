"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { createProfile, checkUsernameAvailable } from "@/lib/profiles"
import { DOMAINS } from "@/data/constants"

const ROLES = [
  { id: "student", icon: "🎓", label: "Student / First-timer", desc: "Excited, building for the first time" },
  { id: "developer", icon: "💻", label: "Developer / Technical", desc: "Knows tools, wants signal on tradeoffs" },
  { id: "designer", icon: "🎨", label: "Designer / Product Thinker", desc: "Thinks in systems and users" },
  { id: "expert", icon: "🏥", label: "Domain Expert", desc: "Deep problem knowledge, less technical" },
]

export default function ProfileSetupPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [headline, setHeadline] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [githubUsername, setGithubUsername] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  // Pre-fill github username from OAuth metadata
  useEffect(() => {
    if (user?.user_metadata?.user_name) {
      setGithubUsername(user.user_metadata.user_name)
    }
    // Pre-fill username from display name
    if (user?.user_metadata?.full_name) {
      const suggested = user.user_metadata.full_name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 20)
      setUsername(suggested)
    }
  }, [user])

  // Debounced username check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }
    setCheckingUsername(true)
    const timer = setTimeout(async () => {
      const available = await checkUsernameAvailable(username)
      setUsernameAvailable(available)
      setCheckingUsername(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [username])

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : prev.length < 3 ? [...prev, domain] : prev
    )
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError("")

    const { error } = await createProfile({
      username,
      headline,
      domains: selectedDomains,
      role: selectedRole,
      github_username: githubUsername,
    })

    if (error) {
      setError(error.includes("unique") ? "That username is taken." : error)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push(`/profile/${username}`), 1600)
  }

  if (loading || !user) return null

  if (success) return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-5">⚡</div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Profile created!</h2>
        <p className="text-zinc-400 text-sm mb-1">+10 CodePoints earned</p>
        <p className="text-zinc-600 text-xs font-mono">taking you there now…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-all ${
                n <= step ? "bg-brand-500" : "bg-surface-2"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Username + headline */}
        {step === 1 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">Step 1 of 3</p>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Claim your handle</h1>
            <p className="text-zinc-500 text-sm mb-8">Your public profile lives at codefest.ai/profile/[username]</p>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                    placeholder="yourname"
                    maxLength={20}
                    className="w-full rounded-xl border border-white/[0.08] bg-surface-1 pl-8 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono">
                    {checkingUsername && <span className="text-zinc-600">...</span>}
                    {!checkingUsername && usernameAvailable === true && <span className="text-brand-400">✓</span>}
                    {!checkingUsername && usernameAvailable === false && <span className="text-red-400">✗</span>}
                  </div>
                </div>
                {usernameAvailable === false && (
                  <p className="text-xs text-red-400 mt-1.5">That username is taken.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                  Headline <span className="text-zinc-700 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="CGU grad student building in health + AI"
                  maxLength={80}
                  className="w-full rounded-xl border border-white/[0.08] bg-surface-1 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                  GitHub <span className="text-zinc-700 normal-case">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">github.com/</span>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={e => setGithubUsername(e.target.value.trim())}
                    placeholder="username"
                    className="w-full rounded-xl border border-white/[0.08] bg-surface-1 pl-[6.5rem] pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!username || username.length < 3 || usernameAvailable === false}
              className="mt-8 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Role */}
        {step === 2 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">Step 2 of 3</p>
            <h1 className="text-2xl font-bold tracking-tight mb-1">How do you show up?</h1>
            <p className="text-zinc-500 text-sm mb-8">How you approach building — not your job title.</p>

            <div className="space-y-2">
              {ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    selectedRole === role.id
                      ? "border-brand-500/40 bg-brand-500/8"
                      : "border-white/[0.06] bg-surface-1/80 hover:border-white/[0.12]"
                  }`}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <div className={`text-sm font-semibold ${selectedRole === role.id ? "text-brand-400" : "text-white"}`}>
                      {role.label}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{role.desc}</div>
                  </div>
                  {selectedRole === role.id && (
                    <span className="ml-auto text-brand-400 text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-white/[0.08] py-3 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-[2] rounded-xl bg-brand-500 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-400"
              >
                Continue →
              </button>
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 3: Domains */}
        {step === 3 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-3">Step 3 of 3</p>
            <h1 className="text-2xl font-bold tracking-tight mb-1">What domains pull you in?</h1>
            <p className="text-zinc-500 text-sm mb-8">Pick up to 3. These shape your component suggestions.</p>

            <div className="grid grid-cols-2 gap-2">
              {DOMAINS.map(domain => {
                const selected = selectedDomains.includes(domain.n)
                const maxed = selectedDomains.length >= 3 && !selected
                return (
                  <button
                    key={domain.n}
                    onClick={() => !maxed && toggleDomain(domain.n)}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      selected
                        ? "border-brand-500/40 bg-brand-500/8"
                        : maxed
                        ? "border-white/[0.04] bg-surface-1/40 opacity-40 cursor-not-allowed"
                        : "border-white/[0.06] bg-surface-1/80 hover:border-white/[0.12]"
                    }`}
                  >
                    <span className="text-xl">{domain.e}</span>
                    <span className={`text-xs font-medium leading-tight ${selected ? "text-brand-400" : "text-zinc-300"}`}>
                      {domain.n}
                    </span>
                  </button>
                )
              })}
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-4">{error}</p>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-xl border border-white/[0.08] py-3 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-[2] rounded-xl bg-brand-500 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-400 disabled:opacity-60"
              >
                {submitting ? "Creating profile..." : "Create my profile →"}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Skip domains
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
