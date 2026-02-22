#!/usr/bin/env node
/**
 * Codefest MCP Server
 *
 * Gives your AI assistant (Claude Desktop, Cursor, Windsurf, etc.) direct access
 * to the Codefest.ai curated hackathon component library — so you get
 * hackathon-aware recommendations instead of generic answers.
 *
 * Tools:
 *   codefest_search_components   — search by keyword, category, difficulty
 *   codefest_get_component       — full details for one component
 *   codefest_list_categories     — all categories with counts
 *   codefest_recommend_stack     — recommended stack for a given problem type
 *   codefest_generate_context    — generate a personalized AI context pack (.md)
 *
 * Install in Claude Desktop:
 *   Add to ~/Library/Application Support/Claude/claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "codefest": {
 *         "command": "node",
 *         "args": ["/path/to/codefest/mcp-server/dist/index.js"]
 *       }
 *     }
 *   }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { COMPONENTS, CATEGORIES, type Component } from "./data.js"

const CHARACTER_LIMIT = 20000

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function componentUrl(name: string): string {
  return `https://codefest.ai/library/${toSlug(name)}`
}

function formatComponent(c: Component, verbose = false): string {
  const lines: string[] = [
    `## ${c.name}`,
    `**Category:** ${c.category} | **Difficulty:** ${c.difficulty} | **Setup:** ~${c.setup_time_minutes}m`,
    ``,
    c.description,
  ]

  if (verbose) {
    if (c.plain_what) lines.push(``, `**What it does:** ${c.plain_what}`)
    if (c.plain_why)  lines.push(`**Why use it:** ${c.plain_why}`)
    if (c.common_use) lines.push(`**Common use:** ${c.common_use}`)
    lines.push(``)
    if (c.tags.length)    lines.push(`**Tags:** ${c.tags.join(", ")}`)
    if (c.related.length) lines.push(`**Often used with:** ${c.related.join(", ")}`)
    lines.push(``)
    if (c.github_url) lines.push(`**GitHub:** ${c.github_url}`)
    if (c.docs_url)   lines.push(`**Docs:** ${c.docs_url}`)
    lines.push(`**Codefest page:** ${componentUrl(c.name)}`)
    if (c.further_reading.length) {
      lines.push(``, `**Go deeper:**`)
      for (const r of c.further_reading) {
        lines.push(`- [${r.title}](${r.url}) *(${r.type})*`)
      }
    }
  } else {
    const links: string[] = []
    if (c.github_url) links.push(`[GitHub](${c.github_url})`)
    if (c.docs_url)   links.push(`[Docs](${c.docs_url})`)
    links.push(`[Codefest](${componentUrl(c.name)})`)
    lines.push(``, links.join(" · "))
  }

  return lines.join("\n")
}

// Stack suggestions per problem type — mirrors workspace/page.tsx STACK_SUGGESTIONS
const STACK_SUGGESTIONS: Record<string, string[]> = {
  map:      ["Next.js", "Tailwind CSS", "Supabase", "react-leaflet"],
  form:     ["Next.js", "Tailwind CSS", "shadcn/ui", "Supabase", "React Hook Form", "Zod"],
  ai:       ["Next.js", "Tailwind CSS", "Supabase", "Vercel AI SDK", "Groq"],
  data:     ["Next.js", "Tailwind CSS", "shadcn/ui", "Supabase", "Recharts", "Tanstack Table"],
  realtime: ["Next.js", "Tailwind CSS", "shadcn/ui", "Supabase Realtime", "Liveblocks"],
  alerts:   ["Next.js", "Tailwind CSS", "Supabase", "React Email", "Resend", "Inngest"],
}

const ACTION_DESCRIPTIONS: Record<string, string> = {
  map:      "Show things on a map — location data, routes, proximity, geographic patterns",
  form:     "Collect info from users — forms, surveys, multi-step intake, validation",
  ai:       "Answer questions with AI — chat, summarization, classification, generation",
  data:     "Visualize data and trends — charts, dashboards, comparisons, time series",
  realtime: "Connect people in real-time — chat, collaboration, live updates, shared state",
  alerts:   "Send alerts and notifications — email, SMS, push notifications, background jobs",
}

// ── Server ────────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "codefest-mcp-server",
  version: "1.0.0",
})

// ── Tool: search_components ───────────────────────────────────────────────────

server.registerTool(
  "codefest_search_components",
  {
    title: "Search Hackathon Components",
    description: `Search the Codefest.ai curated hackathon component library by keyword, category, or difficulty.

Returns components sorted by relevance (name match > tag match > description match), then by setup time ascending.

Use this when:
- Someone asks "what should I use for auth/maps/AI/payments?"
- You need to find components for a specific use case
- You want to explore options in a category

Args:
  - query (string, optional): Search string matched against name, tags, description
  - category (string, optional): Filter by category (auth, ai, database, ui, payments, api, devtools)
  - difficulty (string, optional): Filter by difficulty (beginner, intermediate, advanced)
  - limit (number, optional): Max results to return (default: 10, max: 30)

Returns: Markdown list of matching components with setup times and links.`,
    inputSchema: z.object({
      query:      z.string().optional().describe("Search string — matched against name, tags, and description"),
      category:   z.string().optional().describe(`Category filter. Valid values: ${CATEGORIES.join(", ")}`),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional().describe("Difficulty filter"),
      limit:      z.number().int().min(1).max(30).default(10).describe("Max results (default: 10)"),
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  async ({ query, category, difficulty, limit }) => {
    let results = [...COMPONENTS]

    if (category) {
      results = results.filter(c => c.category === category.toLowerCase())
    }
    if (difficulty) {
      results = results.filter(c => c.difficulty === difficulty)
    }
    if (query) {
      const q = query.toLowerCase()
      results = results
        .map(c => {
          let score = 0
          if (c.name.toLowerCase().includes(q))        score += 10
          if (c.tags.some(t => t.includes(q)))         score += 5
          if (c.description.toLowerCase().includes(q)) score += 2
          if (c.common_use.toLowerCase().includes(q))  score += 1
          return { c, score }
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.c.setup_time_minutes - b.c.setup_time_minutes)
        .map(({ c }) => c)
    } else {
      results.sort((a, b) => a.setup_time_minutes - b.setup_time_minutes)
    }

    const page = results.slice(0, limit)

    if (page.length === 0) {
      return {
        content: [{ type: "text", text: `No components found matching your filters. Try a broader query or remove category/difficulty filters.\n\nAvailable categories: ${CATEGORIES.join(", ")}` }],
      }
    }

    const lines = [
      `# Component Search Results`,
      `Found ${results.length} component${results.length !== 1 ? "s" : ""}${results.length > limit ? ` (showing top ${limit})` : ""}.`,
      ``,
    ]

    for (const c of page) {
      lines.push(`### ${c.name}`)
      lines.push(`**${c.category}** · ${c.difficulty} · ~${c.setup_time_minutes}m setup`)
      lines.push(c.description)
      const links: string[] = []
      if (c.github_url) links.push(`[GitHub](${c.github_url})`)
      if (c.docs_url)   links.push(`[Docs](${c.docs_url})`)
      links.push(`[Codefest](${componentUrl(c.name)})`)
      lines.push(links.join(" · "))
      lines.push(``)
    }

    if (results.length > limit) {
      lines.push(`*${results.length - limit} more results. Use a more specific query or increase limit.*`)
    }

    const text = lines.join("\n")
    return {
      content: [{ type: "text", text: text.length > CHARACTER_LIMIT ? text.slice(0, CHARACTER_LIMIT) + "\n\n*(truncated)*" : text }],
    }
  }
)

// ── Tool: get_component ───────────────────────────────────────────────────────

server.registerTool(
  "codefest_get_component",
  {
    title: "Get Component Details",
    description: `Get full details for a single component in the Codefest library, including plain-language explanation, setup guide links, compatibility notes, related components, and curated further reading.

Use this when:
- Someone asks for details about a specific tool
- You want the full context on why/when to use something
- You need links to setup docs and further reading

Args:
  - name (string): Component name — exact or partial match (e.g. "Supabase Auth", "supabase auth", "supabase")

Returns: Full component profile in markdown.`,
    inputSchema: z.object({
      name: z.string().min(1).describe("Component name (exact or partial, case-insensitive)"),
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  async ({ name }) => {
    const q = name.toLowerCase()
    const exact   = COMPONENTS.find(c => c.name.toLowerCase() === q)
    const partial = COMPONENTS.find(c => c.name.toLowerCase().includes(q))
    const comp    = exact ?? partial

    if (!comp) {
      const suggestions = COMPONENTS
        .filter(c => c.tags.some(t => t.includes(q)) || c.category.includes(q))
        .slice(0, 3)
        .map(c => c.name)
      return {
        content: [{
          type: "text",
          text: `No component found matching "${name}".${suggestions.length ? `\n\nDid you mean: ${suggestions.join(", ")}?` : ""}\n\nUse codefest_search_components to browse the full library.`,
        }],
      }
    }

    return {
      content: [{ type: "text", text: formatComponent(comp, true) }],
    }
  }
)

// ── Tool: list_categories ─────────────────────────────────────────────────────

server.registerTool(
  "codefest_list_categories",
  {
    title: "List Component Categories",
    description: `List all categories in the Codefest library with component counts.

Use this to understand what's available before searching, or when someone asks "what kinds of components are there?"

Returns: Markdown table of categories with counts and example components.`,
    inputSchema: z.object({}).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  async () => {
    const counts: Record<string, number> = {}
    for (const c of COMPONENTS) {
      counts[c.category] = (counts[c.category] ?? 0) + 1
    }

    const lines = [
      `# Codefest Component Categories`,
      `${COMPONENTS.length} total components across ${CATEGORIES.length} categories.`,
      ``,
      `| Category | Count | Examples |`,
      `|----------|-------|---------|`,
    ]

    for (const cat of CATEGORIES) {
      const examples = COMPONENTS
        .filter(c => c.category === cat)
        .sort((a, b) => a.setup_time_minutes - b.setup_time_minutes)
        .slice(0, 3)
        .map(c => c.name)
      lines.push(`| **${cat}** | ${counts[cat]} | ${examples.join(", ")} |`)
    }

    lines.push(``, `Use \`codefest_search_components\` with a category filter to see all components in a category.`)

    return { content: [{ type: "text", text: lines.join("\n") }] }
  }
)

// ── Tool: recommend_stack ─────────────────────────────────────────────────────

server.registerTool(
  "codefest_recommend_stack",
  {
    title: "Recommend Hackathon Stack",
    description: `Get the recommended component stack for a given problem type, sorted by setup order (fastest-to-setup first). Mirrors the Codefest.ai workspace recommendations.

Use this when:
- Someone is starting a hackathon and needs to pick a stack
- They describe a feature type and want the fastest path to working software
- You want to give a complete, opinionated recommendation rather than a menu of options

Args:
  - action (string): Problem type — one of: map, form, ai, data, realtime, alerts
  - domain (string, optional): Problem domain context (e.g. "health", "climate", "civic") — used to tailor the response

Returns: Ordered stack list with setup times, total time estimate, and setup advice.`,
    inputSchema: z.object({
      action: z.enum(["map", "form", "ai", "data", "realtime", "alerts"]).describe(
        "Problem type: map=geographic data, form=user input, ai=LLM features, data=visualization, realtime=live collab, alerts=notifications"
      ),
      domain: z.string().optional().describe("Problem domain context (e.g. health, climate, civic, education)"),
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  async ({ action, domain }) => {
    const stackNames = STACK_SUGGESTIONS[action] ?? []
    const actionDesc = ACTION_DESCRIPTIONS[action] ?? action

    // Find components from library, fall back to stub if not found
    const stack = stackNames.map(name => {
      const comp = COMPONENTS.find(c => c.name.toLowerCase() === name.toLowerCase())
      return comp ?? { name, setup_time_minutes: 0, github_url: "", docs_url: "", description: "", category: "", difficulty: "beginner" as const }
    })

    const totalSetup = stack.reduce((sum, s) => sum + s.setup_time_minutes, 0)

    const lines = [
      `# Recommended Stack: ${actionDesc}`,
      domain ? `*Tailored for ${domain} domain*` : "",
      ``,
      `Set these up in this order — each one unblocks the next.`,
      ``,
    ]

    stack.forEach((s, i) => {
      const links: string[] = []
      if (s.github_url) links.push(`[GitHub](${s.github_url})`)
      if (s.docs_url)   links.push(`[Docs](${s.docs_url})`)
      if ("tags" in s)  links.push(`[Codefest](${componentUrl(s.name)})`)
      lines.push(`**${i + 1}. ${s.name}** (~${s.setup_time_minutes}m)`)
      if ("description" in s && s.description) lines.push(`   ${s.description}`)
      if (links.length) lines.push(`   ${links.join(" · ")}`)
      lines.push(``)
    })

    lines.push(`---`)
    lines.push(`**Total estimated setup: ~${totalSetup} minutes**`)
    lines.push(``)
    lines.push(`### Setup advice`)
    lines.push(`- If you hit 2× the estimated time on any step, skip it and mock that feature`)
    lines.push(`- Build your 3-screen demo path first — everything else is backlog`)
    lines.push(`- Don't add tools not in this list without a specific reason`)
    lines.push(``)
    lines.push(`Use \`codefest_get_component\` for full details on any item above.`)

    return { content: [{ type: "text", text: lines.filter(l => l !== undefined).join("\n") }] }
  }
)

// ── Tool: generate_context ────────────────────────────────────────────────────

server.registerTool(
  "codefest_generate_context",
  {
    title: "Generate Hackathon AI Context Pack",
    description: `Generate a personalized hackathon context pack — a markdown document pre-loaded with your problem, domain, stack, and constraints.

The output is formatted for AI loading: paste it into any AI assistant (Claude, ChatGPT, Cursor system prompt) and your AI instantly understands your setup, constraints, and goals.

Use this at the start of a hackathon to prime your AI tools, or to share a team's context with collaborators.

Args:
  - problem (string): What you're building — the problem statement in 1-3 sentences
  - domain (string): Problem domain (e.g. "health equity", "climate", "civic infrastructure")
  - action (string): Primary feature type — one of: map, form, ai, data, realtime, alerts
  - team_size (number, optional): Team size (default: 3)
  - hours (number, optional): Hackathon duration in hours (default: 24)

Returns: Complete markdown context pack ready to copy into any AI tool.`,
    inputSchema: z.object({
      problem:   z.string().min(10).max(500).describe("Problem statement — what you're building and who it's for"),
      domain:    z.string().min(2).max(100).describe("Problem domain (e.g. health equity, climate, education)"),
      action:    z.enum(["map", "form", "ai", "data", "realtime", "alerts"]).describe("Primary feature type"),
      team_size: z.number().int().min(1).max(10).default(3).describe("Team size (default: 3)"),
      hours:     z.number().min(4).max(72).default(24).describe("Hackathon duration in hours (default: 24)"),
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  async ({ problem, domain, action, team_size, hours }) => {
    const stackNames  = STACK_SUGGESTIONS[action] ?? []
    const actionDesc  = ACTION_DESCRIPTIONS[action] ?? action
    const totalSetup  = stackNames.reduce((sum, name) => {
      const comp = COMPONENTS.find(c => c.name.toLowerCase() === name.toLowerCase())
      return sum + (comp?.setup_time_minutes ?? 0)
    }, 0)

    const stackList = stackNames.map((name, i) => {
      const comp = COMPONENTS.find(c => c.name.toLowerCase() === name.toLowerCase())
      const setup = comp?.setup_time_minutes ?? 0
      const docs  = comp?.docs_url ?? ""
      return `${i + 1}. **${name}** (~${setup}m setup)${docs ? ` — ${docs}` : ""}`
    }).join("\n")

    const md = `# Hackathon Context Pack
> Generated by [Codefest.ai](https://codefest.ai) MCP Server · Load into your AI assistant before building.

---

## The Problem

${problem}

**Domain:** ${domain}
**Core feature type:** ${actionDesc}
**Team size:** ${team_size} people
**Time available:** ${hours} hours

---

## Your Stack

Set these up in order — each one unblocks the next.
Total estimated setup: ~${totalSetup} minutes

${stackList}

---

## Constraints

- This is a ${hours}-hour hackathon. Optimize for a working demo, not production quality.
- Timebox each setup step. If you hit 2× the estimate, skip it and mock that feature.
- Build the **3-screen demo path** first. Everything else is backlog.
- Don't introduce new tools not in the stack above without a specific reason.
- The demo is the product. Judges have 3-5 minutes. One clear "wow moment" beats five half-finished features.

---

## How to Use This File

You're an AI assistant helping a ${team_size}-person team build a hackathon project in ${hours} hours.
The problem, domain, and stack are defined above. Use this context to:

- Give hackathon-specific advice (speed over perfection, mock what's not working)
- Suggest implementations using the specific stack above, not generic alternatives
- Help prioritize what to build vs. cut based on time pressure
- Write code that works with the tech listed — don't suggest alternatives unless asked

Useful prompts to try:
- *"Given this context, help me scaffold the project structure"*
- *"Write the Supabase schema for [my feature] based on this problem"*
- *"I'm [N] hours in and [X] isn't working. What should I cut vs. fix?"*
- *"What's the minimal implementation that proves this idea in a demo?"*

---

## Resources

- Component library: https://codefest.ai/library
- Auth patterns: https://codefest.ai/blog/auth-patterns-for-hackathons
- Stack guide: https://codefest.ai/blog/the-default-stack
- Demo scoping: https://codefest.ai/blog/build-for-the-demo
- Stop wasting the first hour: https://codefest.ai/blog/stop-wasting-the-first-hour

---

*Codefest.ai — participant-first hackathon infrastructure*`

    return { content: [{ type: "text", text: md }] }
  }
)

// ── Start server ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("Codefest MCP server running (stdio)")
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
