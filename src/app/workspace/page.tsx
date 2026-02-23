"use client"

import { useState, useMemo, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import {
  Zap, Clock, ExternalLink, BookOpen, ArrowRight,
  RotateCcw, ChevronDown,
} from "lucide-react"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — lucide-react typings incomplete in this install
import { Settings } from "lucide-react"

// ── Keyword inference ─────────────────────────────────────────────────────

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  climate:   ["climate", "carbon", "emission", "energy", "solar", "renewable", "sustainability",
               "green", "pollution", "waste", "recycling", "temperature", "weather", "forest",
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

// ── Domains ───────────────────────────────────────────────────────────────

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

// ── Actions (problem-language) ─────────────────────────────────────────────

type ActionDef = {
  id: string
  icon: string
  userNeed: string   // problem-language label
  techLabel: string  // tech-language, revealed on expand
  desc: string
  domains: string[]
  stackKeys: string[]
}

const ACTIONS: ActionDef[] = [
  {
    id: "locate",
    icon: "📍",
    userNeed: "Help people find resources near them",
    techLabel: "Geocoding + map display",
    desc: "Show nearby options on a map, filterable by distance, type, or availability.",
    domains: ["food", "health", "civic", "safety", "transport"],
    stackKeys: ["map"],
  },
  {
    id: "route",
    icon: "🗺️",
    userNeed: "Help people get from A to B",
    techLabel: "Routing + turn-by-turn directions",
    desc: "Plan a journey through places, services, or decision steps.",
    domains: ["transport", "civic", "safety", "food"],
    stackKeys: ["map"],
  },
  {
    id: "intake",
    icon: "📋",
    userNeed: "Screen people and collect their information",
    techLabel: "Multi-step form + conditional logic",
    desc: "Gather eligibility info, needs, or preferences through structured input.",
    domains: ["health", "food", "civic", "finance", "safety"],
    stackKeys: ["form"],
  },
  {
    id: "match",
    icon: "🔗",
    userNeed: "Match people to what they need",
    techLabel: "Filtering + recommendation logic",
    desc: "Connect users to resources, services, or other people based on criteria.",
    domains: ["health", "food", "civic", "finance", "education"],
    stackKeys: ["form", "data"],
  },
  {
    id: "ask-ai",
    icon: "💬",
    userNeed: "Let people ask questions and get plain-language answers",
    techLabel: "RAG pipeline + LLM chat interface",
    desc: "Answer questions about documents, services, or policies in plain language.",
    domains: ["health", "education", "civic", "finance", "food"],
    stackKeys: ["ai"],
  },
  {
    id: "report",
    icon: "📊",
    userNeed: "Show patterns in data to decision-makers",
    techLabel: "Dashboard + data visualization",
    desc: "Surface trends, comparisons, and metrics across time or geography.",
    domains: ["climate", "health", "civic", "finance", "education"],
    stackKeys: ["data"],
  },
  {
    id: "alert",
    icon: "🔔",
    userNeed: "Notify people when something changes",
    techLabel: "Event triggers + notification delivery",
    desc: "Send alerts when availability, status, or conditions shift.",
    domains: ["safety", "health", "food", "transport", "climate"],
    stackKeys: ["alerts"],
  },
  {
    id: "track",
    icon: "📈",
    userNeed: "Let people see their progress or status",
    techLabel: "User state + history log",
    desc: "Show users where they are in a process, what has changed, or what is next.",
    domains: ["health", "education", "food", "finance", "civic"],
    stackKeys: ["form", "data"],
  },
  {
    id: "connect",
    icon: "🤝",
    userNeed: "Let people coordinate or communicate in real-time",
    techLabel: "Presence + live messaging",
    desc: "Enable groups to share tasks, chat, or coordinate with each other live.",
    domains: ["civic", "safety", "education", "health"],
    stackKeys: ["realtime"],
  },
  {
    id: "preserve",
    icon: "📦",
    userNeed: "Capture and share what was learned",
    techLabel: "Document storage + search index",
    desc: "Archive decisions, resources, or outcomes so others can find and reuse them.",
    domains: ["education", "civic", "climate", "health"],
    stackKeys: ["data"],
  },
]

function getActionsForDomains(selectedDomains: string[]): ActionDef[] {
  if (selectedDomains.length === 0) return ACTIONS
  // "other" = show everything
  if (selectedDomains.includes("other")) return ACTIONS
  return ACTIONS
    .map(a => ({ action: a, score: a.domains.filter(d => selectedDomains.includes(d)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ action }) => action)
}

// ── Stack ──────────────────────────────────────────────────────────────────

type StackTool = {
  name: string
  href: string
  setup: number
  category: string
  desc: string
  tradeoff?: string
  competesWidth?: string[]
}

type CustomComponent = {
  id: string
  label: string
  desc: string
  buildPrompt: string
  actionIds: string[]
  domains: string[]
}

const LIBRARY_TOOLS: Record<string, StackTool[]> = {
  base: [
    { name: "Next.js",      href: "https://nextjs.org/docs",      setup: 5,  category: "framework", desc: "React framework with routing, API, and SSR built in." },
    { name: "Tailwind CSS", href: "https://tailwindcss.com/docs", setup: 5,  category: "ui",        desc: "Utility-first CSS — no fighting stylesheets." },
    { name: "Supabase",     href: "https://supabase.com/docs",    setup: 10, category: "database",  desc: "Postgres + Auth + Realtime in one dashboard." },
  ],
  map: [
    {
      name: "react-leaflet",
      href: "https://react-leaflet.js.org/docs/start-intro",
      setup: 15, category: "maps",
      desc: "Open-source maps. Works offline. Good for hackathons.",
      tradeoff: "Best if: no budget, offline needed, or simple pins. Skip if: need custom map styles.",
      competesWidth: ["Mapbox GL JS"],
    },
    {
      name: "Mapbox GL JS",
      href: "https://docs.mapbox.com/mapbox-gl-js/",
      setup: 20, category: "maps",
      desc: "Beautiful custom maps with powerful styling and layer control.",
      tradeoff: "Best if: design matters or need advanced layers. Requires API key — free tier is generous.",
      competesWidth: ["react-leaflet"],
    },
  ],
  form: [
    { name: "shadcn/ui",       href: "https://ui.shadcn.com",       setup: 10, category: "ui",         desc: "Copy-paste components. No stylesheet battles." },
    { name: "React Hook Form", href: "https://react-hook-form.com", setup: 10, category: "forms",      desc: "Fast form validation with minimal re-renders." },
    { name: "Zod",             href: "https://zod.dev",             setup: 5,  category: "validation", desc: "TypeScript-first schema validation." },
  ],
  ai: [
    {
      name: "Vercel AI SDK",
      href: "https://sdk.vercel.ai/docs",
      setup: 15, category: "ai",
      desc: "Streaming AI responses in Next.js. Cleanest DX.",
      tradeoff: "Best if: using Next.js and want streaming. Works with any LLM provider.",
      competesWidth: ["LangChain.js"],
    },
    {
      name: "LangChain.js",
      href: "https://js.langchain.com/docs/",
      setup: 25, category: "ai",
      desc: "Powerful chains and agents for complex AI flows.",
      tradeoff: "Best if: building RAG pipelines or multi-step agents. Steeper learning curve.",
      competesWidth: ["Vercel AI SDK"],
    },
    { name: "Groq", href: "https://console.groq.com/docs/openai", setup: 10, category: "llm", desc: "Fast LLM inference, free tier, OpenAI-compatible API." },
  ],
  data: [
    {
      name: "Recharts",
      href: "https://recharts.org/en-US/api",
      setup: 10, category: "charts",
      desc: "React-native charts. Simple API, good defaults.",
      tradeoff: "Best if: basic line/bar/pie. Skip if: need heavy animation or advanced customization.",
      competesWidth: ["Nivo"],
    },
    {
      name: "Nivo",
      href: "https://nivo.rocks/",
      setup: 15, category: "charts",
      desc: "Beautiful, animated charts with responsive support.",
      tradeoff: "Best if: visual quality matters and you have time to configure. Larger bundle.",
      competesWidth: ["Recharts"],
    },
    { name: "shadcn/ui",      href: "https://ui.shadcn.com",                               setup: 10, category: "ui",     desc: "Copy-paste components." },
    { name: "Tanstack Table", href: "https://tanstack.com/table/latest/docs/introduction", setup: 15, category: "tables", desc: "Headless data table — sort, filter, paginate." },
  ],
  alerts: [
    { name: "React Email", href: "https://react.email/docs",     setup: 10, category: "email", desc: "Write emails in React, preview in browser." },
    { name: "Resend",      href: "https://resend.com/docs",      setup: 10, category: "email", desc: "Email delivery with generous free tier." },
    { name: "Inngest",     href: "https://www.inngest.com/docs", setup: 15, category: "jobs",  desc: "Background jobs without a queue setup. Works on Vercel." },
  ],
  realtime: [
    {
      name: "Supabase Realtime",
      href: "https://supabase.com/docs/guides/realtime",
      setup: 20, category: "realtime",
      desc: "Real-time subscriptions on your Supabase tables.",
      tradeoff: "Best if: already using Supabase. Zero extra infra.",
      competesWidth: ["Liveblocks"],
    },
    {
      name: "Liveblocks",
      href: "https://liveblocks.io/docs",
      setup: 20, category: "collab",
      desc: "Collaborative presence, cursors, and live comments.",
      tradeoff: "Best if: need Google Docs-style collaboration or shared cursors.",
      competesWidth: ["Supabase Realtime"],
    },
  ],
}

const CUSTOM_COMPONENTS: CustomComponent[] = [
  {
    id: "mcp-server",
    label: "Custom MCP server",
    desc: "Give your AI structured access to your database, APIs, or domain-specific tools.",
    buildPrompt: "Scaffold a lightweight Model Context Protocol server that exposes [domain data] as tools the AI assistant can call at inference time.",
    actionIds: ["ask-ai"],
    domains: [],
  },
  {
    id: "rag-pipeline",
    label: "RAG document pipeline",
    desc: "Chunk, embed, and query documents so the AI answers accurately from real sources.",
    buildPrompt: "Set up a retrieval-augmented generation pipeline: chunk [document type], generate embeddings, store in Supabase pgvector, and query at inference time.",
    actionIds: ["ask-ai"],
    domains: [],
  },
  {
    id: "eligibility-screener",
    label: "Eligibility screening logic",
    desc: "Rule-based engine that evaluates intake responses against eligibility criteria.",
    buildPrompt: "Build an eligibility screening module that takes structured user input and returns a match score and explanation for [service/resource].",
    actionIds: ["intake", "match"],
    domains: ["health", "food", "civic", "finance"],
  },
  {
    id: "matching-algo",
    label: "Resource matching algorithm",
    desc: "Rank or filter a list of resources by user attributes, location, or preferences.",
    buildPrompt: "Write a matching algorithm that scores [resources] against [user profile fields] and returns a ranked list with explanation for each result.",
    actionIds: ["match"],
    domains: ["food", "health", "civic", "finance"],
  },
  {
    id: "geo-layer",
    label: "Geolocation + proximity API",
    desc: "Wrapper that geocodes addresses, calculates distances, and filters results by radius.",
    buildPrompt: "Write a geolocation utility that geocodes addresses, calculates haversine distance, and filters a list of [resources] by radius.",
    actionIds: ["locate", "route"],
    domains: ["food", "health", "civic", "transport"],
  },
  {
    id: "data-normalizer",
    label: "Data normalization layer",
    desc: "Clean and normalize inconsistent data from multiple sources into a single schema.",
    buildPrompt: "Build a data normalization pipeline that maps [source data format] to a unified schema, handles edge cases, and logs anomalies.",
    actionIds: ["report", "preserve"],
    domains: ["climate", "civic", "health"],
  },
]

function getStackForActions(
  selectedActions: string[],
  selectedDomains: string[],
): { tools: StackTool[]; custom: CustomComponent[] } {
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

// ── Context pack generator ─────────────────────────────────────────────────

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
  const actionList = actionDefs
    .map((a, i) => `${i + 1}. **${a.userNeed}** *(${a.techLabel})*`)
    .join("\n")
  const toolList = tools
    .sort((a, b) => a.setup - b.setup)
    .map((s, i) => `${i + 1}. **${s.name}** (${s.category}, ~${s.setup}m) — ${s.href}`)
    .join("\n")
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

What this project does, in priority order:

${actionList}

---

## Your Stack

Set these up in order — each one unblocks the next.

${toolList}

**Total estimated setup time:** ~${totalSetup} minutes
${customSection}

---

## Constraints

- This is a hackathon. Optimize for a working demo, not production quality.
- Timebox each setup item. If you hit 2× the estimate, skip and mock it.
- Build the 3-screen demo path first. Everything else is backlog.
- Use the stack above — don't introduce new tools unless you have a specific reason.

---

## How to Use This File

Then use prompts like:

- *"Given this context, help me scaffold the Next.js project structure"*
- *"What's the fastest way to implement [feature] with the stack above?"*
- *"I'm 4 hours in and [X] isn't working. What should I cut vs. fix?"*
- *"Write the Supabase schema for [my feature] based on this problem statement"*

Your AI now knows your domain, your problem, and your exact stack.

---

## Resources

- Full component library: https://codefest.ai/library
- Stack selection guide: https://codefest.ai/blog/the-default-stack
- Demo scoping guide: https://codefest.ai/blog/build-for-the-demo
- Pre-hackathon checklist: https://codefest.ai/guide

---

*Codefest.ai — the participant-first hackathon infrastructure layer*
`
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Connector() {
  return (
    <div className="flex justify-start pl-4 my-1">
      <div className="w-px h-6 bg-white/[0.06]" />
    </div>
  )
}

function DoneLayer({ label, onReset }: { label: string; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-surface-0 px-4 py-3">
      <span className="text-sm text-zinc-500 truncate mr-4">{label}</span>
      <button
        onClick={onReset}
        className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors font-mono shrink-0"
      >
        change
      </button>
    </div>
  )
}

function Layer({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="animate-in fade-in slide-in-from-bottom-3 duration-200">
      {children}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const pinnedComponent = searchParams.get("add") ?? null
  const domainParam     = searchParams.get("domain") ?? null

  // ── Cascade state ─────────────────────────────────────────────────────
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

  // ── Scroll refs ───────────────────────────────────────────────────────
  const domainRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)
  const stackRef  = useRef<HTMLDivElement>(null)
  const goRef     = useRef<HTMLDivElement>(null)

  // ── Derived ───────────────────────────────────────────────────────────
  const inferredScores = useMemo(() => scoreDomains(problem), [problem])
  const topScore       = Math.max(...Object.values(inferredScores), 0)
  const hintDomains    = topScore > 0
    ? Object.entries(inferredScores)
        .filter(([, s]) => s > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id)
    : []

  const computedActions = useMemo(() => getActionsForDomains(domains), [domains])

  const selectedDomainDefs = DOMAINS.filter(d => domains.includes(d.id))
  const selectedActionDefs = ACTIONS.filter(a => actions.includes(a.id))

  // tools / custom are computed once when actionsConfirmed; stored in stack/customStack
  // We derive display lists from stored selections
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

  // ── Layer visibility ──────────────────────────────────────────────────
  const showDomains = problem.trim().length > 0 || domains.length > 0
  const showActions = showDomains && domainsConfirmed
  const showStack   = showActions && actionsConfirmed
  const showGo      = showStack   && launched

  // ── Scroll helpers ────────────────────────────────────────────────────
  function scrollTo(ref: React.RefObject<HTMLDivElement>) {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80)
  }

  // ── Handlers ──────────────────────────────────────────────────────────

  function resetFrom(layer: "problem" | "domains" | "actions" | "stack") {
    if (layer === "problem") {
      setProblem(""); setDomains([]); setDomainsConfirmed(false)
      setActions([]); setActionsConfirmed(false)
      setStack([]); setCustomStack([]); setLaunched(false)
    }
    if (layer === "domains") {
      setDomains([]); setDomainsConfirmed(false)
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
    scrollTo(actionRef)
  }

  function toggleAction(id: string) {
    const next = actions.includes(id) ? actions.filter(a => a !== id) : [...actions, id]
    setActions(next)
    setActionsConfirmed(false)
    setStack([]); setCustomStack([]); setLaunched(false)
  }

  function toggleActionExpand(id: string) {
    setExpandedActions(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function confirmActions() {
    if (actions.length === 0) return
    const { tools, custom } = getStackForActions(actions, domains)
    setStack(tools.map(t => t.name))
    setCustomStack(custom.map(c => c.id))
    setActionsConfirmed(true)
    scrollTo(stackRef)
  }

  function handleLaunch() {
    setLaunched(true)
    scrollTo(goRef)
  }

  function downloadContextPack() {
    const md = generateContextMd({
      problem,
      domainDefs:  selectedDomainDefs,
      actionDefs:  selectedActionDefs,
      tools:       goTools,
      custom:      selectedCustom,
      totalSetup,
    })
    const blob = new Blob([md], { type: "text/markdown" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = "hackathon-context.md"; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-0">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-surface-0 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 transition-shadow group-hover:shadow-lg group-hover:shadow-brand-500/25">
              <Zap className="h-4 w-4 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              codefest<span className="text-brand-400">.ai</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">workspace</span>
            {launched && (
              <button
                onClick={() => resetFrom("problem")}
                className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                restart
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Cascade ─────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-2xl px-6 pt-28 pb-32 space-y-0">

        {/* Pinned component banner */}
        {pinnedComponent && (
          <div className="flex items-center gap-3 rounded-xl border border-brand-500/25 bg-brand-500/5 px-4 py-3 mb-6">
            <BookOpen className="h-4 w-4 text-brand-400 shrink-0" />
            <span className="text-xs text-zinc-500">
              <span className="text-brand-400 font-medium">{pinnedComponent}</span>
              {" "}will be added to your stack
            </span>
          </div>
        )}

        {/* ── Layer 0: Problem ──────────────────────────────────────────── */}
        {domainsConfirmed && problem.trim().length > 0 ? (
          <DoneLayer
            label={problem.length > 72 ? problem.slice(0, 72) + "…" : problem}
            onReset={() => resetFrom("problem")}
          />
        ) : (
          <Layer id="layer-problem">
            <div className="mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                what are you solving?
              </span>
            </div>
            <textarea
              value={problem}
              onChange={e => setProblem(e.target.value)}
              placeholder="Who is stuck, and what are they stuck doing?"
              className="w-full rounded-xl border border-white/[0.08] bg-surface-1 px-5 py-4 text-sm text-zinc-200 placeholder-zinc-700 resize-none focus:outline-none focus:border-brand-500/40 transition-colors leading-relaxed"
              rows={3}
              autoFocus
            />
            {/* Live domain hints */}
            {hintDomains.length > 0 && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono text-zinc-700">detected →</span>
                {hintDomains.slice(0, 4).map(id => {
                  const d = DOMAINS.find(d => d.id === id)
                  if (!d) return null
                  return (
                    <span
                      key={id}
                      className="text-[10px] font-mono text-zinc-500 bg-surface-2 rounded px-1.5 py-0.5"
                    >
                      {d.emoji} {d.label}
                    </span>
                  )
                })}
              </div>
            )}
            {problem.trim().length > 0 && (
              <p className="mt-2 text-[11px] text-zinc-700 font-mono">
                pick your domain{domains.length !== 1 ? "s" : ""} below ↓
              </p>
            )}
          </Layer>
        )}

        {/* ── Layer 1: Domains ──────────────────────────────────────────── */}
        {showDomains && (
          <>
            <Connector />
            <div ref={domainRef}>
              {domainsConfirmed ? (
                <DoneLayer
                  label={selectedDomainDefs.length > 0
                    ? selectedDomainDefs.map(d => `${d.emoji} ${d.label}`).join(" · ")
                    : "Domains"}
                  onReset={() => resetFrom("domains")}
                />
              ) : (
                <Layer id="layer-domains">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">domains</span>
                    <span className="text-[10px] text-zinc-700">select all that apply</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {DOMAINS.map(d => {
                      const score    = inferredScores[d.id] || 0
                      const inferred = score > 0
                      const selected = domains.includes(d.id)
                      return (
                        <button
                          key={d.id}
                          onClick={() => toggleDomain(d.id)}
                          className={`relative flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all
                            ${selected
                              ? "border-brand-500/40 bg-brand-500/8 text-white"
                              : inferred
                                ? "border-brand-500/20 bg-surface-1 text-zinc-300 hover:border-brand-500/35 hover:bg-surface-2"
                                : "border-white/[0.06] bg-surface-1 text-zinc-400 hover:border-brand-500/25 hover:bg-surface-2 hover:text-zinc-200"
                            }`}
                        >
                          {/* Inference indicator dot */}
                          {inferred && !selected && (
                            <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-500/60" />
                          )}
                          <span className="text-lg shrink-0">{d.emoji}</span>
                          <span className="text-xs font-medium leading-snug">{d.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={confirmDomains}
                    disabled={domains.length === 0}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/8 px-6 py-3 text-sm font-medium text-brand-400 hover:bg-brand-500/15 hover:border-brand-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Confirm {domains.length > 0 ? `${domains.length} domain${domains.length !== 1 ? "s" : ""}` : "domains"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Layer>
              )}
            </div>
          </>
        )}

        {/* ── Layer 2: Actions ──────────────────────────────────────────── */}
        {showActions && (
          <>
            <Connector />
            <div ref={actionRef}>
              {actionsConfirmed ? (
                <DoneLayer
                  label={selectedActionDefs.length === 1
                    ? `${selectedActionDefs[0].icon} ${selectedActionDefs[0].userNeed}`
                    : selectedActionDefs.length > 1
                      ? `${selectedActionDefs[0].icon} ${selectedActionDefs[0].userNeed} +${selectedActionDefs.length - 1} more`
                      : "Actions"
                  }
                  onReset={() => resetFrom("actions")}
                />
              ) : (
                <Layer id="layer-actions">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">what does it do?</span>
                    <span className="text-[10px] text-zinc-700">select all that apply</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {computedActions.map(a => {
                      const selected = actions.includes(a.id)
                      const expanded = expandedActions.has(a.id)
                      return (
                        <div
                          key={a.id}
                          className={`rounded-xl border transition-all ${
                            selected
                              ? "border-brand-500/40 bg-brand-500/[0.05]"
                              : "border-white/[0.06] bg-surface-1"
                          }`}
                        >
                          {/* Main row — toggle selection */}
                          <button
                            onClick={() => toggleAction(a.id)}
                            className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
                          >
                            <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selected ? "border-brand-500 bg-brand-500" : "border-zinc-700"}`}>
                              {selected && (
                                <svg className="h-2.5 w-2.5 text-black" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-lg shrink-0">{a.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium leading-snug ${selected ? "text-white" : "text-zinc-300"}`}>
                                {a.userNeed}
                              </p>
                              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{a.desc}</p>
                            </div>
                          </button>
                          {/* Tech label expand */}
                          <button
                            onClick={() => toggleActionExpand(a.id)}
                            className="flex items-center gap-1.5 px-4 pb-3 text-[10px] font-mono text-zinc-700 hover:text-zinc-500 transition-colors"
                          >
                            {expanded
                              ? <><ChevronDown className="h-3 w-3" />{a.techLabel}</>
                              : <><ArrowRight className="h-3 w-3" />see tech stack</>
                            }
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={confirmActions}
                    disabled={actions.length === 0}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/8 px-6 py-3 text-sm font-medium text-brand-400 hover:bg-brand-500/15 hover:border-brand-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Confirm {actions.length > 0 ? `${actions.length} feature${actions.length !== 1 ? "s" : ""}` : "features"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Layer>
              )}
            </div>
          </>
        )}

        {/* ── Layer 3: Stack ────────────────────────────────────────────── */}
        {showStack && (
          <>
            <Connector />
            <div ref={stackRef}>
              {launched ? (
                <DoneLayer
                  label={`${stack.length} tool${stack.length !== 1 ? "s" : ""}${selectedCustom.length > 0 ? ` + ${selectedCustom.length} custom` : ""} · ~${totalSetup}min`}
                  onReset={() => resetFrom("stack")}
                />
              ) : (
                <Layer id="layer-stack">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">your stack</span>
                    <span className="text-[10px] text-zinc-700">deselect anything you already have</span>
                  </div>

                  {/* Third-party library tools */}
                  <div className="space-y-1.5 mb-5">
                    {allTools.map(item => {
                      const on = stack.includes(item.name)
                      return (
                        <div
                          key={item.name}
                          className={`rounded-xl border transition-all ${
                            on
                              ? "border-brand-500/30 bg-brand-500/[0.04]"
                              : "border-white/[0.04] bg-surface-1/40 opacity-40"
                          }`}
                        >
                          <button
                            onClick={() => setStack(on ? stack.filter(s => s !== item.name) : [...stack, item.name])}
                            className="w-full flex items-center justify-between px-4 py-3 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${on ? "border-brand-500 bg-brand-500" : "border-zinc-700"}`}>
                                {on && (
                                  <svg className="h-2.5 w-2.5 text-black" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <span className="text-sm text-zinc-200">{item.name}</span>
                                <span className="ml-2 text-xs text-zinc-600">{item.category}</span>
                              </div>
                            </div>
                            <span className="text-xs text-zinc-600 flex items-center gap-1 shrink-0">
                              <Clock className="h-3 w-3" />
                              ~{item.setup}m
                            </span>
                          </button>
                          {/* Tradeoff note — shown when selected and competing tools exist */}
                          {item.tradeoff && on && (
                            <div className="px-4 pb-3">
                              <p className="text-[11px] text-zinc-600 leading-relaxed border-l-2 border-brand-500/20 pl-3 ml-7">
                                {item.tradeoff}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Custom / AI-scaffolded components */}
                  {allCustom.length > 0 && (
                    <>
                      <div className="mb-2.5 flex items-center gap-2">
                        <Settings className="h-3 w-3 text-zinc-600" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">build with ai</span>
                        <span className="text-[10px] text-zinc-700">your AI will scaffold these</span>
                      </div>
                      <div className="space-y-1.5 mb-5">
                        {allCustom.map(item => {
                          const on = customStack.includes(item.id)
                          return (
                            <div
                              key={item.id}
                              className={`rounded-xl border transition-all ${
                                on
                                  ? "border-zinc-600/40 bg-surface-2/60"
                                  : "border-white/[0.04] bg-surface-1/40 opacity-40"
                              }`}
                            >
                              <button
                                onClick={() => setCustomStack(on ? customStack.filter(c => c !== item.id) : [...customStack, item.id])}
                                className="w-full flex items-start gap-3 px-4 py-3 text-left"
                              >
                                <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${on ? "border-zinc-500 bg-zinc-600" : "border-zinc-700"}`}>
                                  {on && (
                                    <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                      <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm text-zinc-300">{item.label}</span>
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 bg-surface-2 rounded px-1.5 py-0.5">custom</span>
                                  </div>
                                  <p className="text-xs text-zinc-600 leading-relaxed">{item.desc}</p>
                                </div>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}

                  {/* Setup total + launch */}
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-surface-1 px-4 py-3 mb-4">
                    <span className="text-xs text-zinc-500">estimated setup</span>
                    <span className="font-mono text-sm text-zinc-200">~{totalSetup} min</span>
                  </div>
                  <button
                    onClick={handleLaunch}
                    disabled={stack.length === 0 && customStack.length === 0}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-black hover:bg-brand-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Zap className="h-4 w-4" />
                    Build this
                  </button>
                </Layer>
              )}
            </div>
          </>
        )}

        {/* ── Layer 4: GO ───────────────────────────────────────────────── */}
        {showGo && (
          <>
            <Connector />
            <div ref={goRef}>
              <Layer id="layer-go">
                {/* Header — problem + domain tags */}
                <div className="rounded-t-xl border border-b-0 border-brand-500/20 bg-brand-500/[0.04] px-5 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-3.5 w-3.5 text-brand-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-500">ready to build</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-2.5">{problem}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDomainDefs.map(d => (
                      <span key={d.id} className="text-[10px] font-mono text-zinc-500 bg-surface-2 rounded-full px-2 py-0.5">
                        {d.emoji} {d.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="border border-b-0 border-brand-500/10 bg-surface-1 divide-y divide-white/[0.04]">
                  <div className="px-5 py-2.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">features</span>
                  </div>
                  {selectedActionDefs.map(a => (
                    <div key={a.id} className="px-5 py-3 flex items-start gap-3">
                      <span className="text-base shrink-0 mt-0.5">{a.icon}</span>
                      <div>
                        <p className="text-sm text-zinc-300">{a.userNeed}</p>
                        <p className="text-[11px] text-zinc-600 font-mono mt-0.5">{a.techLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Third-party tools */}
                <div className="border border-b-0 border-brand-500/10 bg-surface-1 divide-y divide-white/[0.04]">
                  <div className="px-5 py-2.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">install</span>
                  </div>
                  {goTools
                    .slice()
                    .sort((a, b) => a.setup - b.setup)
                    .map((item, i) => (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-5 py-4 hover:bg-surface-2 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[10px] text-zinc-700 w-4 shrink-0">{i + 1}</span>
                          <div>
                            <p className="text-sm text-zinc-200 group-hover:text-white transition-colors">{item.name}</p>
                            <p className="text-xs text-zinc-600">{item.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-zinc-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />~{item.setup}m
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                        </div>
                      </a>
                    ))}
                </div>

                {/* Custom components */}
                {selectedCustom.length > 0 && (
                  <div className="border border-b-0 border-brand-500/10 bg-surface-1 divide-y divide-white/[0.04]">
                    <div className="px-5 py-2.5 flex items-center gap-2">
                      <Settings className="h-3 w-3 text-zinc-600" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">build with ai</span>
                    </div>
                    {selectedCustom.map(item => (
                      <div key={item.id} className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-sm text-zinc-300">{item.label}</p>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 bg-surface-2 rounded px-1.5 py-0.5">custom</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed font-mono bg-surface-2 rounded-lg px-3 py-2">
                          {item.buildPrompt}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer — total + export */}
                <div className="rounded-b-xl border border-brand-500/10 bg-surface-1 px-5 py-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    ~{totalSetup} min total setup
                  </span>
                  <button
                    onClick={downloadContextPack}
                    className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-black hover:bg-brand-400 transition-all"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Export context pack
                  </button>
                </div>

                {/* Secondary actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {!user && (
                    <Link
                      href="/login"
                      className="rounded-lg border border-brand-500/30 px-4 py-2 text-xs text-brand-400 hover:bg-brand-500/10 transition-colors"
                    >
                      Save this plan →
                    </Link>
                  )}
                  <Link
                    href="/library"
                    className="rounded-lg border border-white/[0.08] px-4 py-2 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                  >
                    Browse full library
                  </Link>
                  <button
                    onClick={() => resetFrom("problem")}
                    className="rounded-lg border border-white/[0.06] px-4 py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Start over
                  </button>
                </div>
              </Layer>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
