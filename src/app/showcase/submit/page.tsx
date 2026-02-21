"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { submitShowcaseProject, type ShowcaseFormData } from "@/lib/showcase"
import { useAuth } from "@/components/AuthProvider"
import { DOMAINS, SDGS, CATEGORIES } from "@/data/constants"

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i)

// Curated list of well-known hackathon platforms
const PLATFORM_SUGGESTIONS = [
  "Devpost", "Dorahacks", "TAIKAI", "HackerEarth", "Major League Hacking",
  "Hack the Hood", "AngelHack", "Campus event", "Internal / Company", "Other"
]

const DOMAIN_LIST = DOMAINS.map(d => d.name)
const SDG_LIST = SDGS.map(s => s.name)

// Pull component names from the library categories for stack picker
const STACK_SUGGESTIONS = [
  // Auth
  "Supabase Auth", "NextAuth", "Clerk", "Firebase Auth",
  // DB / Backend
  "Supabase", "Firebase", "PlanetScale", "Neon", "Prisma", "Drizzle",
  // Frontend
  "Next.js", "React", "Vue", "Svelte", "Tailwind CSS", "shadcn/ui",
  // AI / ML
  "OpenAI API", "Anthropic Claude", "Hugging Face", "LangChain", "Replicate",
  // Charts / Maps
  "Recharts", "Mapbox", "Leaflet", "D3.js",
  // Payments
  "Stripe", "LemonSqueezy",
  // Deploy
  "Vercel", "Railway", "Render", "Fly.io",
  // Other
  "Twilio", "Resend", "Cloudinary", "Pinecone", "Weaviate",
]

export default function SubmitShowcasePage() {
  const router = useRouter()
  const { user } = useAuth()

  const [form, setForm] = useState<ShowcaseFormData>({
    title: "",
    description: "",
    hackathon_name: "",
    hackathon_year: String(CURRENT_YEAR),
    domain: "",
    sdgs: [],
    stack: [],
    devpost_url: "",
    github_url: "",
    demo_url: "",
    lesson: "",
    award: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stackInput, setStackInput] = useState("")

  function set(field: keyof ShowcaseFormData, value: string | string[]) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleSDG(sdg: string) {
    set("sdgs", form.sdgs.includes(sdg)
      ? form.sdgs.filter(s => s !== sdg)
      : [...form.sdgs, sdg])
  }

  function toggleStack(item: string) {
    set("stack", form.stack.includes(item)
      ? form.stack.filter(s => s !== item)
      : [...form.stack, item])
  }

  function addCustomStack() {
    const val = stackInput.trim()
    if (val && !form.stack.includes(val)) {
      set("stack", [...form.stack, val])
    }
    setStackInput("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.description || !form.hackathon_name) {
      setError("Title, description, and hackathon name are required.")
      return
    }
    if (!form.devpost_url && !form.github_url) {
      setError("At least one of Devpost URL or GitHub URL is required.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const { id } = await submitShowcaseProject(form)
      router.push(`/showcase?submitted=${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="sp-page" style={{ paddingTop: "88px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "380px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>◇</div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Sign in to submit</h2>
          <p style={{ fontSize: "13px", color: "var(--sp-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Your submission is attributed to your account so you can update it later.
          </p>
          <Link href="/login" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "10px 20px", background: "var(--sp-brand)", color: "#000", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>
            sign in with Google
          </Link>
        </div>
      </div>
    )
  }

  const labelStyle = { fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textTransform: "uppercase" as const, letterSpacing: "0.1em", display: "block", marginBottom: "6px" }
  const inputStyle = { width: "100%", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "8px", padding: "10px 12px", color: "var(--sp-text)", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const }
  const fieldStyle = { marginBottom: "1.5rem" }

  return (
    <div className="sp-page" style={{ paddingTop: "88px", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 1.5rem" }}>

        <Link href="/showcase" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)", textDecoration: "none", display: "inline-block", marginBottom: "2rem" }}>
          ← showcase
        </Link>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            preservation layer
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: "8px" }}>
            Submit your project
          </h1>
          <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
            Point to where your project already lives — Devpost, GitHub, wherever. We add the context that makes it useful for the next person building something similar.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Basic info */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "20px", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
              01 — project info
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Project title *</label>
              <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. EquityBridge" required />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>What did it do? *</label>
              <textarea
                style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="2–4 sentences. What problem did it solve and for whom?"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px", ...fieldStyle }}>
              <div>
                <label style={labelStyle}>Hackathon name *</label>
                <input
                  style={inputStyle}
                  list="hackathon-suggestions"
                  value={form.hackathon_name}
                  onChange={e => set("hackathon_name", e.target.value)}
                  placeholder="e.g. CGU IST Hackathon"
                  required
                />
                <datalist id="hackathon-suggestions">
                  {PLATFORM_SUGGESTIONS.map(p => <option key={p} value={p} />)}
                </datalist>
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.hackathon_year} onChange={e => set("hackathon_year", e.target.value)}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Award / placement (optional)</label>
              <input style={inputStyle} value={form.award} onChange={e => set("award", e.target.value)} placeholder="e.g. 1st Place – Climate Track" />
            </div>
          </div>

          {/* Links */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "20px", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
              02 — links (at least one required)
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Devpost URL</label>
              <input style={inputStyle} type="url" value={form.devpost_url} onChange={e => set("devpost_url", e.target.value)} placeholder="https://devpost.com/software/your-project" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>GitHub URL</label>
              <input style={inputStyle} type="url" value={form.github_url} onChange={e => set("github_url", e.target.value)} placeholder="https://github.com/you/your-project" />
            </div>

            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={labelStyle}>Live demo / video (optional)</label>
              <input style={inputStyle} type="url" value={form.demo_url} onChange={e => set("demo_url", e.target.value)} placeholder="https://your-demo.vercel.app or YouTube link" />
            </div>
          </div>

          {/* Domain + SDGs */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "20px", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
              03 — domain & impact
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Primary domain</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {DOMAIN_LIST.map(d => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => set("domain", d === form.domain ? "" : d)}
                    style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "4px 10px", borderRadius: "5px", border: `1px solid ${d === form.domain ? "var(--sp-brand)" : "var(--sp-border)"}`, background: d === form.domain ? "var(--sp-brand-dim)" : "var(--sp-surface2)", color: d === form.domain ? "var(--sp-brand)" : "var(--sp-muted)", cursor: "pointer" }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label style={labelStyle}>SDGs addressed (optional)</label>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {SDG_LIST.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSDG(s)}
                    style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", padding: "3px 8px", borderRadius: "4px", border: `1px solid ${form.sdgs.includes(s) ? "rgba(96,165,250,0.4)" : "var(--sp-border)"}`, background: form.sdgs.includes(s) ? "rgba(96,165,250,0.1)" : "var(--sp-surface2)", color: form.sdgs.includes(s) ? "#60a5fa" : "var(--sp-muted)", cursor: "pointer" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stack */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "20px", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
              04 — tech stack
            </div>
            <p style={{ fontSize: "11px", color: "var(--sp-dim)", marginBottom: "14px" }}>
              What did you actually use? This is what makes your project useful to the next team.
            </p>

            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" }}>
              {STACK_SUGGESTIONS.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleStack(s)}
                  style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 9px", borderRadius: "5px", border: `1px solid ${form.stack.includes(s) ? "var(--sp-brand)" : "var(--sp-border)"}`, background: form.stack.includes(s) ? "var(--sp-brand-dim)" : "var(--sp-surface2)", color: form.stack.includes(s) ? "var(--sp-brand)" : "var(--sp-muted)", cursor: "pointer" }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={stackInput}
                onChange={e => setStackInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomStack() } }}
                placeholder="Add custom tool… (Enter to add)"
              />
              <button type="button" onClick={addCustomStack} style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "10px 14px", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "8px", color: "var(--sp-muted)", cursor: "pointer" }}>
                add
              </button>
            </div>

            {form.stack.length > 0 && (
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "10px" }}>
                {form.stack.map(s => (
                  <span key={s} style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 9px", borderRadius: "5px", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.25)", color: "var(--sp-brand)", display: "flex", alignItems: "center", gap: "5px" }}>
                    {s}
                    <button type="button" onClick={() => toggleStack(s)} style={{ background: "none", border: "none", color: "var(--sp-brand)", cursor: "pointer", fontSize: "12px", lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Lesson */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "20px", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>
              05 — one lesson learned
            </div>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              value={form.lesson}
              onChange={e => set("lesson", e.target.value)}
              placeholder="What would you tell the next team building something similar? The single most useful thing you learned."
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem", fontSize: "13px", color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{ fontFamily: "var(--sp-mono)", fontSize: "12px", padding: "12px 28px", background: submitting ? "var(--sp-surface2)" : "var(--sp-brand)", color: submitting ? "var(--sp-muted)" : "#000", borderRadius: "9px", fontWeight: 700, border: "none", cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "submitting…" : "submit project"}
            </button>
            <Link href="/showcase" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)", textDecoration: "none" }}>
              cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}
