"use client"

import { useState, useMemo, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import {
  Zap, Clock, ExternalLink, BookOpen, ArrowRight,
  RotateCcw, ChevronDown, FileText, Layers, CheckCircle2,
  Copy, X, Upload,
} from "lucide-react"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — lucide-react typings incomplete in this install
import { Settings } from "lucide-react"

// ── Keyword inference ──────────────────────────────────────────────────────

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  climate:   ["climate", "carbon", "emission", "energy", "solar", "renewable", "sustainability",
               "green", "pollution", "recycling", "temperature", "weather", "forest",
               "water", "drought", "wildfire", "ecosystem", "biodiversity", "greenhouse"],
  health:    ["health", "medical", "patient", "doctor", "hospital", "clinic", "mental health",
               "wellness", "disability", "chronic", "aging", "elderly", "medicine", "prescription",
               "therapy", "healthcare", "diagnosis", "rehab", "nurse", "caregiver"],
  education: ["education", "school", "student", "teacher", "learning", "tutoring", "literacy",
               "training", "curriculum", "university", "college", "skills", "course", "classroom",
               "homework", "reading", "tutor", "academic", "dropout", "access to education"],
  food:      ["food", "meal", "hunger", "nutrition", "grocery", "pantry", "food bank", "insecurity",
               "restaurant", "farming", "agriculture", "crops", "diet", "cooking", "ingredients",
               "organic", "produce", "eating", "calories", "food desert"],
  finance:   ["finance", "money", "bank", "loan", "credit", "debt", "savings", "income",
               "poverty", "unbanked", "microfinance", "payment", "budget", "financial",
               "wage", "rent", "mortgage", "insurance", "cost", "afford"],
  civic:     ["civic", "housing", "homeless", "shelter", "community", "government", "immigration",
               "refugee", "underserved", "marginalized", "equity", "social", "nonprofit",
               "volunteer", "public", "citizen", "voting", "policy", "access", "rights"],
  safety:    ["safety", "emergency", "crime", "violence", "abuse", "trafficking", "disaster",
               "evacuation", "fire", "police", "crisis", "first responder", "domestic violence",
               "harassment", "security", "911", "threat", "danger", "unsafe"],
  transport: ["transport", "transit", "bus", "train", "subway", "ride", "commute", "mobility",
               "accessibility", "wheelchair", "pedestrian", "bike", "navigation", "route",
               "traffic", "public transit", "car", "driving", "getting around"],
}

function scoreDomains(text: string): Record<string, number> {
  const lower = text.toLowerCase()
  const scores: Record<string, number> = {}
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    scores[domain] = keywords.filter(kw => lower.includes(kw)).length
  }
  return scores
}

// ── Domains ────────────────────────────────────────────────────────────────

const DOMAINS = [
  { id: "climate",   emoji: "🌱", label: "Climate & Environment" },
  { id: "health",    emoji: "🏥", label: "Health & Wellness" },
  { id: "education", emoji: "📚", label: "Education & Learning" },
  { id: "food",      emoji: "🍎", label: "Food & Agriculture" },
  { id: "finance",   emoji: "💰", label: "Finance & Access" },
  { id: "civic",     emoji: "🏛️", label: "Civic & Community" },
  { id: "safety",    emoji: "🛡️", label: "Safety & Emergency" },
  { id: "transport", emoji: "🚌", label: "Transport & Mobility" },
  { id: "other",     emoji: "✨", label: "Something else" },
]

// ── Actions ────────────────────────────────────────────────────────────────

type ActionDef = {
  id: string
  icon: string
  userNeed: string
  techLabel: string
  desc: string
  domains: string[]
  stackKeys: string[]
}

const ACTIONS: ActionDef[] = [
  {
    id: "locate", icon: "📍",
    userNeed: "Help people find resources near them",
    techLabel: "Geocoding + map display",
    desc: "Show nearby options on a map, filterable by distance, type, or availability.",
    domains: ["food", "health", "civic", "safety", "transport"], stackKeys: ["map"],
  },
  {
    id: "route", icon: "🗺️",
    userNeed: "Help people get from A to B",
    techLabel: "Routing + turn-by-turn directions",
    desc: "Plan a journey through places, services, or decision steps.",
    domains: ["transport", "civic", "safety", "food"], stackKeys: ["map"],
  },
  {
    id: "intake", icon: "📋",
    userNeed: "Screen people and collect their information",
    techLabel: "Multi-step form + conditional logic",
    desc: "Gather eligibility info, needs, or preferences through structured input.",
    domains: ["health", "food", "civic", "finance", "safety"], stackKeys: ["form"],
  },
  {
    id: "match", icon: "🔗",
    userNeed: "Match people to what they need",
    techLabel: "Filtering + recommendation logic",
    desc: "Connect users to resources, services, or other people based on criteria.",
    domains: ["health", "food", "civic", "finance", "education"], stackKeys: ["form", "data"],
  },
  {
    id: "ask-ai", icon: "💬",
    userNeed: "Let people ask questions and get plain-language answers",
    techLabel: "RAG pipeline + LLM chat interface",
    desc: "Answer questions about documents, services, or policies in plain language.",
    domains: ["health", "education", "civic", "finance", "food"], stackKeys: ["ai"],
  },
  {
    id: "report", icon: "📊",
    userNeed: "Show patterns in data to decision-makers",
    techLabel: "Dashboard + data visualization",
    desc: "Surface trends, comparisons, and metrics across time or geography.",
    domains: ["climate", "health", "civic", "finance", "education"], stackKeys: ["data"],
  },
  {
    id: "alert", icon: "🔔",
    userNeed: "Notify people when something changes",
    techLabel: "Event triggers + notification delivery",
    desc: "Send alerts when availability, status, or conditions shift.",
    domains: ["safety", "health", "food", "transport", "climate"], stackKeys: ["alerts"],
  },
  {
    id: "track", icon: "📈",
    userNeed: "Let people see their progress or status",
    techLabel: "User state + history log",
    desc: "Show users where they are in a process, what has changed, or what is next.",
    domains: ["health", "education", "food", "finance", "civic"], stackKeys: ["form", "data"],
  },
  {
    id: "connect", icon: "🤝",
    userNeed: "Let people coordinate or communicate in real-time",
    techLabel: "Presence + live messaging",
    desc: "Enable groups to share tasks, chat, or coordinate with each other live.",
    domains: ["civic", "safety", "education", "health"], stackKeys: ["realtime"],
  },
  {
    id: "preserve", icon: "📦",
    userNeed: "Capture and share what was learned",
    techLabel: "Document storage + search index",
    desc: "Archive decisions, resources, or outcomes so others can find and reuse them.",
    domains: ["education", "civic", "climate", "health"], stackKeys: ["data"],
  },
]

function getActionsForDomains(selectedDomains: string[]): ActionDef[] {
  if (selectedDomains.length === 0) return ACTIONS
  if (selectedDomains.includes("other")) return ACTIONS
  return ACTIONS
    .map(a => ({ action: a, score: a.domains.filter(d => selectedDomains.includes(d)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ action }) => action)
}

// ── Stack ──────────────────────────────────────────────────────────────────

type StackTool = {
  name: string; href: string; setup: number; category: string; desc: string
  tradeoff?: string; competesWidth?: string[]; optIn?: boolean
}

type CustomComponent = {
  id: string; label: string; desc: string; buildPrompt: string
  actionIds: string[]; domains: string[]
}

const LIBRARY_TOOLS: Record<string, StackTool[]> = {
  base: [
    { name: "Next.js",      href: "https://nextjs.org/docs",      setup: 5,  category: "framework", desc: "React framework with routing, API, and SSR built in." },
    { name: "Tailwind CSS", href: "https://tailwindcss.com/docs", setup: 5,  category: "ui",        desc: "Utility-first CSS — no fighting stylesheets." },
    { name: "Supabase",     href: "https://supabase.com/docs",    setup: 10, category: "database",  desc: "Postgres + Auth + Realtime in one dashboard." },
  ],
  map: [
    { name: "react-leaflet", href: "https://react-leaflet.js.org/docs/start-intro", setup: 15, category: "maps",
      desc: "Open-source maps. Works offline. Good for hackathons.",
      tradeoff: "Best if: no budget, offline needed, or simple pins.", competesWidth: ["Mapbox GL JS"] },
    { name: "Mapbox GL JS", href: "https://docs.mapbox.com/mapbox-gl-js/", setup: 20, category: "maps",
      desc: "Beautiful custom maps with powerful styling and layer control.",
      tradeoff: "Best if: design matters or need advanced layers. Requires API key.", competesWidth: ["react-leaflet"], optIn: true },
  ],
  form: [
    { name: "shadcn/ui",       href: "https://ui.shadcn.com",       setup: 10, category: "ui",         desc: "Copy-paste components. No stylesheet battles." },
    { name: "React Hook Form", href: "https://react-hook-form.com", setup: 10, category: "forms",      desc: "Fast form validation with minimal re-renders." },
    { name: "Zod",             href: "https://zod.dev",             setup: 5,  category: "validation", desc: "TypeScript-first schema validation." },
  ],
  ai: [
    { name: "Vercel AI SDK", href: "https://sdk.vercel.ai/docs", setup: 15, category: "ai",
      desc: "Streaming AI responses in Next.js. Cleanest DX.", tradeoff: "Best if: using Next.js and want streaming.", competesWidth: ["LangChain.js"] },
    { name: "LangChain.js", href: "https://js.langchain.com/docs/", setup: 25, category: "ai",
      desc: "Powerful chains and agents for complex AI flows.", tradeoff: "Best if: building RAG pipelines or multi-step agents.", competesWidth: ["Vercel AI SDK"], optIn: true },
    { name: "Groq", href: "https://console.groq.com/docs/openai", setup: 10, category: "llm", desc: "Fast LLM inference, free tier, OpenAI-compatible API." },
  ],
  data: [
    { name: "Recharts",      href: "https://recharts.org/en-US/api",                              setup: 10, category: "charts", desc: "React-native charts. Simple API, good defaults.", tradeoff: "Best if: basic line/bar/pie.", competesWidth: ["Nivo"] },
    { name: "Nivo",          href: "https://nivo.rocks/",                                         setup: 15, category: "charts", desc: "Beautiful, animated charts with responsive support.", tradeoff: "Best if: visual quality matters and you have time to configure.", competesWidth: ["Recharts"], optIn: true },
    { name: "shadcn/ui",     href: "https://ui.shadcn.com",                                       setup: 10, category: "ui",     desc: "Copy-paste components." },
    { name: "Tanstack Table",href: "https://tanstack.com/table/latest/docs/introduction",         setup: 15, category: "tables", desc: "Headless data table — sort, filter, paginate." },
  ],
  alerts: [
    { name: "React Email", href: "https://react.email/docs",     setup: 10, category: "email", desc: "Write emails in React, preview in browser." },
    { name: "Resend",      href: "https://resend.com/docs",      setup: 10, category: "email", desc: "Email delivery with generous free tier." },
    { name: "Inngest",     href: "https://www.inngest.com/docs", setup: 15, category: "jobs",  desc: "Background jobs without a queue setup." },
  ],
  realtime: [
    { name: "Supabase Realtime", href: "https://supabase.com/docs/guides/realtime", setup: 20, category: "realtime",
      desc: "Real-time subscriptions on your Supabase tables.", tradeoff: "Best if: already using Supabase.", competesWidth: ["Liveblocks"] },
    { name: "Liveblocks", href: "https://liveblocks.io/docs", setup: 20, category: "collab",
      desc: "Collaborative presence, cursors, and live comments.", tradeoff: "Best if: need Google Docs-style collaboration.", competesWidth: ["Supabase Realtime"] },
  ],
}

const CUSTOM_COMPONENTS: CustomComponent[] = [
  { id: "mcp-server", label: "Custom MCP server", desc: "Give your AI structured access to your database, APIs, or domain-specific tools.",
    buildPrompt: "Scaffold a lightweight Model Context Protocol server that exposes [domain data] as tools the AI assistant can call at inference time.",
    actionIds: ["ask-ai"], domains: [] },
  { id: "rag-pipeline", label: "RAG document pipeline", desc: "Chunk, embed, and query documents so the AI answers accurately from real sources.",
    buildPrompt: "Set up a retrieval-augmented generation pipeline: chunk [document type], generate embeddings, store in Supabase pgvector, and query at inference time.",
    actionIds: ["ask-ai"], domains: [] },
  { id: "eligibility-screener", label: "Eligibility screening logic", desc: "Rule-based engine that evaluates intake responses against eligibility criteria.",
    buildPrompt: "Build an eligibility screening module that takes structured user input and returns a match score and explanation for [service/resource].",
    actionIds: ["intake", "match"], domains: ["health", "food", "civic", "finance"] },
  { id: "matching-algo", label: "Resource matching algorithm", desc: "Rank or filter a list of resources by user attributes, location, or preferences.",
    buildPrompt: "Write a matching algorithm that scores [resources] against [user profile fields] and returns a ranked list with explanation for each result.",
    actionIds: ["match"], domains: ["food", "health", "civic", "finance"] },
  { id: "geo-layer", label: "Geolocation + proximity API", desc: "Wrapper that geocodes addresses, calculates distances, and filters results by radius.",
    buildPrompt: "Write a geolocation utility that geocodes addresses, calculates haversine distance, and filters a list of [resources] by radius.",
    actionIds: ["locate", "route"], domains: ["food", "health", "civic", "transport"] },
  { id: "data-normalizer", label: "Data normalization layer", desc: "Clean and normalize inconsistent data from multiple sources into a single schema.",
    buildPrompt: "Build a data normalization pipeline that maps [source data format] to a unified schema, handles edge cases, and logs anomalies.",
    actionIds: ["report", "preserve"], domains: ["climate", "civic", "health"] },
]

function getStackForActions(selectedActions: string[], selectedDomains: string[]): { tools: StackTool[]; custom: CustomComponent[] } {
  const keys = new Set<string>(["base"])
  for (const id of selectedActions) {
    ACTIONS.find(a => a.id === id)?.stackKeys.forEach(k => keys.add(k))
  }
  const seen = new Set<string>()
  const tools: StackTool[] = []
  for (const key of keys) {
    for (const tool of LIBRARY_TOOLS[key] || []) {
      if (!seen.has(tool.name)) { seen.add(tool.name); tools.push(tool) }
    }
  }
  const custom = CUSTOM_COMPONENTS.filter(c => {
    const actionMatch = c.actionIds.some(id => selectedActions.includes(id))
    const domainMatch = c.domains.length === 0 || c.domains.some(d => selectedDomains.includes(d))
    return actionMatch && domainMatch
  })
  return { tools, custom }
}

// ── Context pack ───────────────────────────────────────────────────────────

function generateContextMd(opts: {
  problem: string
  domainDefs: Array<{ emoji: string; label: string }>
  actionDefs: Array<{ userNeed: string; techLabel: string }>
  tools: StackTool[]
  custom: CustomComponent[]
  totalSetup: number
}): string {
  const { problem, domainDefs, actionDefs, tools, custom, totalSetup } = opts
  const domainTags = domainDefs.map(d => `${d.emoji} ${d.label}`).join(" · ")
  const actionList = actionDefs.map((a, i) => `${i + 1}. **${a.userNeed}** *(${a.techLabel})*`).join("\n")
  const toolList = tools.sort((a, b) => a.setup - b.setup)
    .map((s, i) => `${i + 1}. **${s.name}** (${s.category}, ~${s.setup}m) — ${s.href}`).join("\n")
  const customSection = custom.length > 0
    ? `\n\n## Custom Components to Build\n\nAsk your AI to scaffold these:\n\n` +
      custom.map(c => `- **${c.label}**: ${c.buildPrompt}`).join("\n")
    : ""

  return `# Hackathon Context Pack
> Generated by [Codefest.ai](https://codefest.ai) · Paste into your AI assistant before you start building.

---

## The Problem

${problem}

**Domains:** ${domainTags}

---

## Core Features

${actionList}

---

## Your Stack

${toolList}

**Total estimated setup time:** ~${totalSetup} minutes
${customSection}

---

## Constraints

- This is a hackathon. Optimize for a working demo, not production quality.
- Timebox each setup item. If you hit 2× the estimate, skip and mock it.
- Build the 3-screen demo path first. Everything else is backlog.

---

## Starter Prompts

- *"Given this context, help me scaffold the Next.js project structure"*
- *"What's the fastest way to implement [feature] with the stack above?"*
- *"I'm 4 hours in and [X] isn't working. What should I cut vs. fix?"*

---

*Codefest.ai — the participant-first hackathon infrastructure layer*
`
}

// ── Import template ────────────────────────────────────────────────────────

const IMPORT_TEMPLATE = `I'm setting up my hackathon workspace on codefest.ai. Based on what you know about our project, please fill out this template exactly — don't add extra commentary, just fill in the fields:

---BEGIN CODEFEST SESSION---

PROBLEM: [one or two sentences — who is stuck and what are they stuck doing?]

DOMAINS: [comma-separated, choose any that apply: climate, health, education, food, finance, civic, safety, transport, other]

FEATURES:
- [pick from these exactly, one per line:
  Help people find resources near them
  Help people get from A to B
  Screen people and collect their information
  Match people to what they need
  Let people ask questions and get plain-language answers
  Show patterns in data to decision-makers
  Notify people when something changes
  Let people see their progress or status
  Let people coordinate or communicate in real-time
  Capture and share what was learned]

STACK (optional — list tools/libraries you're already using):
- [one per line, or leave blank]

---END CODEFEST SESSION---`

function parseImport(text: string): {
  problem?: string
  domains?: string[]
  actions?: string[]
} {
  // Try to extract between markers; fall back to full text
  const markerMatch = text.match(/---BEGIN CODEFEST SESSION---\n([\s\S]*?)---END CODEFEST SESSION---/)
  const content = markerMatch ? markerMatch[1] : text

  // PROBLEM
  const problemMatch = content.match(/PROBLEM:\s*([\s\S]+?)(?=\n\s*\n[A-Z]+:|$)/)
  const problem = problemMatch?.[1]?.replace(/\[.*?\]/g, "").trim()

  // DOMAINS — match by id
  const domainsMatch = content.match(/DOMAINS:\s*([\s\S]+?)(?=\n\s*\n[A-Z]+:|$)/)
  const domainText = (domainsMatch?.[1] || "").toLowerCase()
  const domains = DOMAINS
    .filter(d => domainText.includes(d.id))
    .map(d => d.id)

  // FEATURES — fuzzy match first ~25 chars of userNeed
  const featuresMatch = content.match(/FEATURES:\s*([\s\S]+?)(?=\n\s*\n[A-Z]+:|---END|$)/)
  const featuresText = (featuresMatch?.[1] || "").toLowerCase()
  const actions = ACTIONS
    .filter(a => featuresText.includes(a.userNeed.toLowerCase().slice(0, 25)))
    .map(a => a.id)

  return { problem, domains, actions }
}

// ── Board zone component ───────────────────────────────────────────────────

function BoardZone({
  icon, label, children, active, faint,
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode; active?: boolean; faint?: boolean
}) {
  return (
    <div className={`rounded-xl border transition-all duration-300 ${
      active ? "border-white/[0.08] bg-surface-1" : "border-white/[0.04] bg-surface-0"
    } ${faint ? "opacity-40" : ""}`}>
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${active ? "border-white/[0.06]" : "border-white/[0.03]"}`}>
        <span className={active ? "text-zinc-500" : "text-zinc-700"}>{icon}</span>
        <span className={`font-mono text-[10px] uppercase tracking-widest ${active ? "text-zinc-500" : "text-zinc-700"}`}>
          {label}
        </span>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const pinnedComponent = searchParams.get("add") ?? null
  const domainParam     = searchParams.get("domain") ?? null

  // ── State ───────────────────────────────────────────────────────────
  const [problem,          setProblem]          = useState("")
  const [domains,          setDomains]          = useState<string[]>(
    domainParam && DOMAINS.find(d => d.id === domainParam) ? [domainParam] : []
  )
  const [domainsConfirmed, setDomainsConfirmed] = useState(false)
  const [actions,          setActions]          = useState<string[]>([])
  const [actionsConfirmed, setActionsConfirmed] = useState(false)
  const [stack,            setStack]            = useState<string[]>([])
  const [customStack,      setCustomStack]      = useState<string[]>([])
  const [launched,         setLaunched]         = useState(false)
  const [expandedActions,  setExpandedActions]  = useState<Set<string>>(new Set())
  const [sessionName]                           = useState("Hackathon Session")
  const [showImport,     setShowImport]         = useState(false)
  const [importStep,     setImportStep]         = useState<"copy" | "paste">("copy")
  const [importText,     setImportText]         = useState("")
  const [importCopied,   setImportCopied]       = useState(false)
  const [importError,    setImportError]        = useState("")

  const actionRef = useRef<HTMLDivElement>(null)
  const stackRef  = useRef<HTMLDivElement>(null)
  const goRef     = useRef<HTMLDivElement>(null)
  const leftRef   = useRef<HTMLDivElement>(null)

  // ── Derived ─────────────────────────────────────────────────────────
  const inferredScores = useMemo(() => scoreDomains(problem), [problem])
  const topScore       = Math.max(...Object.values(inferredScores), 0)
  const hintDomains    = topScore > 0
    ? Object.entries(inferredScores).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).map(([id]) => id)
    : []

  const computedActions    = useMemo(() => getActionsForDomains(domains), [domains])
  const selectedDomainDefs = DOMAINS.filter(d => domains.includes(d.id))
  const selectedActionDefs = ACTIONS.filter(a => actions.includes(a.id))

  const allTools = useMemo(
    () => getStackForActions(actions, domains).tools,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionsConfirmed ? actions.join(",") : null, actionsConfirmed ? domains.join(",") : null]
  )
  const allCustom = useMemo(
    () => getStackForActions(actions, domains).custom,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionsConfirmed ? actions.join(",") : null, actionsConfirmed ? domains.join(",") : null]
  )

  const selectedTools  = allTools.filter(t => stack.includes(t.name))
  const selectedCustom = allCustom.filter(c => customStack.includes(c.id))

  const pinnedItem: StackTool[] = pinnedComponent && !selectedTools.find(s => s.name === pinnedComponent)
    ? [{ name: pinnedComponent, href: `/library/${pinnedComponent.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, setup: 0, category: "from library", desc: "Added from library" }]
    : []
  const goTools    = [...selectedTools, ...pinnedItem]
  const totalSetup = selectedTools.reduce((sum, s) => sum + s.setup, 0)

  const showActions = domainsConfirmed
  const showStack   = actionsConfirmed

  // ── Handlers ────────────────────────────────────────────────────────

  function scrollLeft(ref: React.RefObject<HTMLDivElement>) {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80)
  }

  function resetFrom(layer: "problem" | "domains" | "actions" | "stack") {
    if (layer === "problem" || layer === "domains") {
      setProblem(""); setDomains([]); setDomainsConfirmed(false)
      setActions([]); setActionsConfirmed(false)
      setStack([]); setCustomStack([]); setLaunched(false)
    }
    if (layer === "actions") {
      setActions([]); setActionsConfirmed(false)
      setStack([]); setCustomStack([]); setLaunched(false)
    }
    if (layer === "stack") { setStack([]); setCustomStack([]); setLaunched(false) }
  }

  function toggleDomain(id: string) {
    const next = domains.includes(id) ? domains.filter(d => d !== id) : [...domains, id]
    setDomains(next)
    setDomainsConfirmed(false)
    setActions([]); setActionsConfirmed(false)
    setStack([]); setCustomStack([]); setLaunched(false)
  }

  function confirmDomains() {
    if (domains.length === 0) return
    setDomainsConfirmed(true)
    scrollLeft(actionRef)
  }

  function toggleAction(id: string) {
    const next = actions.includes(id) ? actions.filter(a => a !== id) : [...actions, id]
    setActions(next)
    setActionsConfirmed(false)
    setStack([]); setCustomStack([]); setLaunched(false)
  }

  function toggleActionExpand(id: string) {
    setExpandedActions(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function confirmActions() {
    if (actions.length === 0) return
    const { tools, custom } = getStackForActions(actions, domains)
    setStack(tools.filter(t => !t.optIn).map(t => t.name))
    setCustomStack(custom.map(c => c.id))
    setActionsConfirmed(true)
    scrollLeft(stackRef)
  }

  function handleLaunch() {
    setLaunched(true)
    scrollLeft(goRef)
  }

  function downloadContextPack() {
    const md = generateContextMd({ problem, domainDefs: selectedDomainDefs, actionDefs: selectedActionDefs, tools: goTools, custom: selectedCustom, totalSetup })
    const blob = new Blob([md], { type: "text/markdown" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = "hackathon-context.md"; a.click()
    URL.revokeObjectURL(url)
  }

  function copyTemplate() {
    navigator.clipboard.writeText(IMPORT_TEMPLATE)
    setImportCopied(true)
    setTimeout(() => setImportCopied(false), 2000)
  }

  function applyImport() {
    const parsed = parseImport(importText)
    if (!parsed.problem && (!parsed.domains || parsed.domains.length === 0)) {
      setImportError("Couldn't parse this — make sure you pasted the AI's full response.")
      return
    }
    // Reset everything
    resetFrom("problem")
    // Apply parsed values
    if (parsed.problem) setProblem(parsed.problem)
    if (parsed.domains && parsed.domains.length > 0) {
      setDomains(parsed.domains)
      setDomainsConfirmed(true)
    }
    if (parsed.actions && parsed.actions.length > 0) {
      setActions(parsed.actions)
      setActionsConfirmed(true)
      const { tools, custom } = getStackForActions(parsed.actions, parsed.domains || [])
      setStack(tools.filter(t => !t.optIn).map(t => t.name))
      setCustomStack(custom.map(c => c.id))
    }
    setShowImport(false)
    setImportText("")
    setImportStep("copy")
    setImportError("")
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-surface-0 flex flex-col overflow-hidden">

      {/* ── Session bar ───────────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-white/[0.06] bg-surface-0">
        <div className="flex h-12 items-center justify-between px-5">
          {/* Left: logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 transition-shadow group-hover:shadow-lg group-hover:shadow-brand-500/25">
              <Zap className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              codefest<span className="text-brand-400">.ai</span>
            </span>
          </Link>

          {/* Center: session name + template badge — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-300">{sessionName}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 border border-white/[0.06] rounded px-1.5 py-0.5">
              default template
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              onClick={() => { setShowImport(true); setImportStep("copy") }}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 md:px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <Upload className="h-3 w-3" />
              <span className="hidden md:inline">Import from AI</span>
            </button>
            {launched && (
              <button
                onClick={downloadContextPack}
                className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-2.5 md:px-3 py-1.5 text-xs font-semibold text-black hover:bg-brand-400 transition-all"
              >
                <BookOpen className="h-3 w-3" />
                <span className="hidden md:inline">Export .md</span>
              </button>
            )}
            <a
              href="https://ko-fi.com/codefest"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500 hover:text-brand-400 transition-colors border border-white/[0.06] hover:border-brand-500/25 rounded-lg px-2.5 py-1.5"
              title="Support codefest"
            >
              ☕ <span className="hidden md:inline">Support</span>
            </a>
            {!user && launched && (
              <Link
                href="/login"
                className="hidden md:inline text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-white/[0.06] rounded-lg px-3 py-1.5"
              >
                Save session
              </Link>
            )}
            <button
              onClick={() => resetFrom("problem")}
              className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden md:inline">restart</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main split ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

        {/* ── LEFT PANEL: Control / Cascade ─────────────────────────── */}
        <div
          ref={leftRef}
          className="w-full md:w-[400px] shrink-0 border-b md:border-b-0 md:border-r border-white/[0.06] md:overflow-y-auto flex flex-col"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="p-5 space-y-5">

            {/* Pinned component banner */}
            {pinnedComponent && (
              <div className="flex items-center gap-3 rounded-xl border border-brand-500/25 bg-brand-500/5 px-4 py-3">
                <BookOpen className="h-4 w-4 text-brand-400 shrink-0" />
                <span className="text-xs text-zinc-500">
                  <span className="text-brand-400 font-medium">{pinnedComponent}</span> will be added to your stack
                </span>
              </div>
            )}

            {/* ── Problem ─────────────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  what are you solving?
                </span>
                {problem.trim().length > 0 && domainsConfirmed && (
                  <button
                    onClick={() => resetFrom("problem")}
                    className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors"
                  >
                    change
                  </button>
                )}
              </div>
              <textarea
                value={problem}
                onChange={e => {
                  setProblem(e.target.value)
                  if (domainsConfirmed) {
                    setDomainsConfirmed(false)
                    setActions([]); setActionsConfirmed(false)
                    setStack([]); setCustomStack([]); setLaunched(false)
                  }
                }}
                placeholder="Who is stuck, and what are they stuck doing?"
                className="w-full rounded-xl border border-white/[0.08] bg-surface-1 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 resize-none focus:outline-none focus:border-brand-500/40 transition-colors leading-relaxed"
                rows={3}
                autoFocus
              />
            </div>

            {/* ── Domains (always visible) ─────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">domains</span>
                {domainsConfirmed && (
                  <button onClick={() => resetFrom("domains")} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">
                    change
                  </button>
                )}
              </div>

              {domainsConfirmed ? (
                /* Confirmed — show compact tags */
                <div className="flex flex-wrap gap-1.5 py-1">
                  {selectedDomainDefs.map(d => (
                    <span key={d.id} className="flex items-center gap-1.5 rounded-lg border border-brand-500/30 bg-brand-500/[0.06] px-3 py-1.5 text-xs text-brand-400">
                      {d.emoji} {d.label}
                    </span>
                  ))}
                </div>
              ) : (
                /* Active — full grid */
                <>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {DOMAINS.map(d => {
                      const score    = inferredScores[d.id] || 0
                      const inferred = score > 0
                      const selected = domains.includes(d.id)
                      return (
                        <button
                          key={d.id}
                          onClick={() => toggleDomain(d.id)}
                          className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                            selected
                              ? "border-brand-500/40 bg-brand-500/[0.08] text-white"
                              : inferred
                                ? "border-brand-500/20 bg-surface-1 text-zinc-300 hover:border-brand-500/35"
                                : "border-white/[0.06] bg-surface-1 text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200"
                          }`}
                        >
                          {inferred && !selected && (
                            <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-400/70" />
                          )}
                          <span className="shrink-0">{d.emoji}</span>
                          <span className="font-medium leading-snug">{d.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={confirmDomains}
                    disabled={domains.length === 0}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/[0.06] px-4 py-2.5 text-xs font-medium text-brand-400 hover:bg-brand-500/12 hover:border-brand-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Confirm {domains.length > 0 ? `${domains.length} domain${domains.length !== 1 ? "s" : ""}` : "domains"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* ── Actions (after domains confirmed) ─────────────────────── */}
            {showActions && (
              <div ref={actionRef} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">what does it do?</span>
                  {actionsConfirmed && (
                    <button onClick={() => resetFrom("actions")} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">
                      change
                    </button>
                  )}
                </div>

                {actionsConfirmed ? (
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {selectedActionDefs.map(a => (
                      <span key={a.id} className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface-1 px-3 py-1.5 text-xs text-zinc-300">
                        {a.icon} {a.userNeed}
                      </span>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5 mb-3">
                      {computedActions.map(a => {
                        const selected = actions.includes(a.id)
                        const expanded = expandedActions.has(a.id)
                        return (
                          <div key={a.id} className={`rounded-xl border transition-all ${selected ? "border-brand-500/40 bg-brand-500/[0.04]" : "border-white/[0.06] bg-surface-1"}`}>
                            <button onClick={() => toggleAction(a.id)} className="w-full flex items-start gap-3 px-3 py-3 text-left">
                              <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selected ? "border-brand-500 bg-brand-500" : "border-zinc-700"}`}>
                                {selected && <svg className="h-2.5 w-2.5 text-black" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span className="text-base shrink-0">{a.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium leading-snug ${selected ? "text-white" : "text-zinc-300"}`}>{a.userNeed}</p>
                                <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{a.desc}</p>
                              </div>
                            </button>
                            <button onClick={() => toggleActionExpand(a.id)} className="flex items-center gap-1.5 px-3 pb-2.5 text-[10px] font-mono text-zinc-700 hover:text-zinc-500 transition-colors">
                              {expanded ? <><ChevronDown className="h-3 w-3" />{a.techLabel}</> : <><ArrowRight className="h-3 w-3" />see tech</>}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <button
                      onClick={confirmActions}
                      disabled={actions.length === 0}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/[0.06] px-4 py-2.5 text-xs font-medium text-brand-400 hover:bg-brand-500/12 hover:border-brand-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Confirm {actions.length > 0 ? `${actions.length} feature${actions.length !== 1 ? "s" : ""}` : "features"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── Stack (after actions confirmed) ───────────────────────── */}
            {showStack && (
              <div ref={stackRef} className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">your stack</span>
                  {launched && (
                    <button onClick={() => resetFrom("stack")} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">
                      change
                    </button>
                  )}
                </div>

                {launched ? (
                  <div className="rounded-xl border border-brand-500/20 bg-brand-500/[0.03] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-400" />
                      <span className="text-xs text-brand-400 font-medium">
                        {stack.length} tool{stack.length !== 1 ? "s" : ""}{selectedCustom.length > 0 ? ` + ${selectedCustom.length} custom` : ""} · ~{totalSetup}min
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] text-zinc-700 font-mono mb-2">deselect anything you already have set up</p>
                    <div className="space-y-1 mb-3">
                      {allTools.map(item => {
                        const on = stack.includes(item.name)
                        return (
                          <div key={item.name} className={`rounded-xl border transition-all ${on ? "border-brand-500/25 bg-brand-500/[0.03]" : "border-white/[0.04] bg-surface-1/40 opacity-40"}`}>
                            <button onClick={() => setStack(on ? stack.filter(s => s !== item.name) : [...stack, item.name])} className="w-full flex items-center justify-between px-3 py-2.5 text-left">
                              <div className="flex items-center gap-2.5">
                                <div className={`h-3.5 w-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${on ? "border-brand-500 bg-brand-500" : "border-zinc-700"}`}>
                                  {on && <svg className="h-2 w-2 text-black" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                <span className="text-xs text-zinc-200">{item.name}</span>
                                <span className="text-[10px] text-zinc-600">{item.category}</span>
                              </div>
                              <span className="text-[10px] text-zinc-600 flex items-center gap-1 shrink-0">
                                <Clock className="h-2.5 w-2.5" />~{item.setup}m
                              </span>
                            </button>
                          </div>
                        )
                      })}
                    </div>

                    {allCustom.length > 0 && (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="h-3 w-3 text-zinc-600" />
                          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">build with ai</span>
                        </div>
                        <div className="space-y-1 mb-3">
                          {allCustom.map(item => {
                            const on = customStack.includes(item.id)
                            return (
                              <div key={item.id} className={`rounded-xl border transition-all ${on ? "border-zinc-600/30 bg-surface-2/60" : "border-white/[0.04] bg-surface-1/40 opacity-40"}`}>
                                <button onClick={() => setCustomStack(on ? customStack.filter(c => c !== item.id) : [...customStack, item.id])} className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left">
                                  <div className={`h-3.5 w-3.5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${on ? "border-zinc-500 bg-zinc-600" : "border-zinc-700"}`}>
                                    {on && <svg className="h-2 w-2 text-white" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-300">{item.label}</p>
                                    <p className="text-[10px] text-zinc-600 leading-relaxed">{item.desc}</p>
                                  </div>
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-zinc-600 mb-3 px-1">
                      <span>total setup</span>
                      <span className="font-mono text-zinc-400">~{totalSetup} min</span>
                    </div>
                    <button
                      ref={goRef as React.RefObject<HTMLButtonElement>}
                      onClick={handleLaunch}
                      disabled={stack.length === 0 && customStack.length === 0}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-black hover:bg-brand-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Zap className="h-4 w-4" />
                      Build this
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT PANEL: Board ─────────────────────────────────────── */}
        <div className="flex-1 md:overflow-y-auto bg-surface-0" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
          <div className="p-6 space-y-3 max-w-2xl">

            {/* Board header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-zinc-200">Session board</h2>
                <p className="text-xs text-zinc-600 font-mono mt-0.5">
                  {launched ? "ready to build" : domainsConfirmed ? actionsConfirmed ? "finalize your stack" : "select your features" : "fill in the left panel to build your session"}
                </p>
              </div>
              {launched && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  session ready
                </div>
              )}
            </div>

            {/* Zone 1: Problem brief */}
            <BoardZone
              icon={<FileText className="h-3.5 w-3.5" />}
              label="Problem brief"
              active={problem.trim().length > 0}
              faint={problem.trim().length === 0}
            >
              {problem.trim().length > 0 ? (
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-2">{problem}</p>
                  {domains.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDomainDefs.map(d => (
                        <span key={d.id} className={`text-[10px] font-mono rounded-full px-2 py-0.5 ${domainsConfirmed ? "text-brand-400 bg-brand-500/10 border border-brand-500/20" : "text-zinc-500 bg-surface-2 border border-white/[0.06]"}`}>
                          {d.emoji} {d.label}
                        </span>
                      ))}
                      {hintDomains.filter(id => !domains.includes(id)).slice(0, 2).map(id => {
                        const d = DOMAINS.find(x => x.id === id)
                        if (!d) return null
                        return (
                          <span key={id} className="text-[10px] font-mono rounded-full px-2 py-0.5 text-zinc-700 bg-surface-1 border border-white/[0.04]">
                            {d.emoji} {d.label} ?
                          </span>
                        )
                      })}
                    </div>
                  )}
                  {domains.length === 0 && hintDomains.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-mono text-zinc-700">suggested →</span>
                      {hintDomains.slice(0, 3).map(id => {
                        const d = DOMAINS.find(x => x.id === id)
                        if (!d) return null
                        return <span key={id} className="text-[10px] font-mono rounded-full px-2 py-0.5 text-zinc-600 bg-surface-1 border border-white/[0.04]">{d.emoji} {d.label}</span>
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-700 italic">Describe your problem on the left to get started.</p>
              )}
            </BoardZone>

            {/* Zone 2: Features */}
            <BoardZone
              icon={<Layers className="h-3.5 w-3.5" />}
              label="Features"
              active={actionsConfirmed}
              faint={!domainsConfirmed}
            >
              {actionsConfirmed && selectedActionDefs.length > 0 ? (
                <div className="space-y-2">
                  {selectedActionDefs.map(a => (
                    <div key={a.id} className="flex items-start gap-3">
                      <span className="text-base shrink-0">{a.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-zinc-200">{a.userNeed}</p>
                        <p className="text-[10px] text-zinc-600 font-mono">{a.techLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : domainsConfirmed ? (
                <p className="text-xs text-zinc-600 italic">Select what your project does on the left.</p>
              ) : (
                <p className="text-xs text-zinc-700 italic">Confirm your domains first.</p>
              )}
            </BoardZone>

            {/* Zone 3: Stack */}
            <BoardZone
              icon={<Settings className="h-3.5 w-3.5" />}
              label="Stack"
              active={launched}
              faint={!actionsConfirmed}
            >
              {launched && goTools.length > 0 ? (
                <div className="space-y-1">
                  {goTools.sort((a, b) => a.setup - b.setup).map((item, i) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 hover:opacity-80 transition-opacity group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-zinc-700 w-4 shrink-0">{i + 1}</span>
                        <div>
                          <p className="text-xs text-zinc-200 group-hover:text-white transition-colors">{item.name}</p>
                          <p className="text-[10px] text-zinc-600">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />~{item.setup}m
                        </span>
                        <ExternalLink className="h-3 w-3 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </a>
                  ))}
                  {selectedCustom.length > 0 && (
                    <>
                      <div className="pt-2 pb-1">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">build with ai</span>
                      </div>
                      {selectedCustom.map(item => (
                        <div key={item.id} className="py-2 border-b border-white/[0.04] last:border-0">
                          <p className="text-xs text-zinc-300 mb-1">{item.label}</p>
                          <p className="text-[10px] text-zinc-600 font-mono leading-relaxed bg-surface-2 rounded px-2.5 py-1.5">{item.buildPrompt}</p>
                        </div>
                      ))}
                    </>
                  )}
                  {/* Summary row */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> ~{totalSetup} min total setup
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={downloadContextPack}
                        className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-[10px] font-semibold text-black hover:bg-brand-400 transition-all"
                      >
                        <BookOpen className="h-3 w-3" />
                        Export context pack
                      </button>
                      {!user && (
                        <Link
                          href="/login"
                          className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-colors"
                        >
                          Save session
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : actionsConfirmed ? (
                <p className="text-xs text-zinc-600 italic">Confirm your stack and hit "Build this" on the left.</p>
              ) : (
                <p className="text-xs text-zinc-700 italic">Your recommended stack will appear here.</p>
              )}
            </BoardZone>

            {/* Bottom: library link */}
            <div className="pt-2">
              <Link href="/library" className="text-[10px] font-mono text-zinc-700 hover:text-zinc-500 transition-colors">
                browse the full component library →
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Import from AI modal ──────────────────────────────────── */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-surface-1 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Import from AI</h3>
                <p className="text-[10px] font-mono text-zinc-600 mt-0.5">
                  {importStep === "copy" ? "Step 1 of 2 — copy this prompt" : "Step 2 of 2 — paste the response"}
                </p>
              </div>
              <button onClick={() => { setShowImport(false); setImportStep("copy"); setImportText(""); setImportError("") }}>
                <X className="h-4 w-4 text-zinc-600 hover:text-zinc-300 transition-colors" />
              </button>
            </div>

            {importStep === "copy" ? (
              /* Step 1: Copy template prompt */
              <div className="p-5">
                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                  Your AI already has your project context. Paste this prompt into it — it will fill out your session template, then bring it back here.
                </p>
                <div className="relative rounded-xl border border-white/[0.06] bg-surface-0 p-4 mb-4">
                  <pre className="text-[10px] text-zinc-500 font-mono leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                    {IMPORT_TEMPLATE}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyTemplate}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/[0.06] px-4 py-2.5 text-xs font-medium text-brand-400 hover:bg-brand-500/12 transition-all"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {importCopied ? "Copied!" : "Copy prompt"}
                  </button>
                  <button
                    onClick={() => setImportStep("paste")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                  >
                    I've got the response →
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Paste response */
              <div className="p-5">
                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                  Paste your AI's filled-out response below. We'll extract the fields and populate your session board.
                </p>
                <textarea
                  value={importText}
                  onChange={e => { setImportText(e.target.value); setImportError("") }}
                  placeholder="Paste the AI's response here..."
                  className="w-full rounded-xl border border-white/[0.08] bg-surface-0 px-4 py-3 text-xs text-zinc-300 placeholder-zinc-700 resize-none focus:outline-none focus:border-brand-500/40 transition-colors font-mono leading-relaxed mb-2"
                  rows={10}
                  autoFocus
                />
                {importError && (
                  <p className="text-[10px] text-red-400 font-mono mb-3">{importError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setImportStep("copy")}
                    className="px-4 py-2.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    ← back
                  </button>
                  <button
                    onClick={applyImport}
                    disabled={importText.trim().length === 0}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-black hover:bg-brand-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Populate my session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
