import { NextRequest } from "next/server"
import componentsData from "@/data/components_seed.json"

type Component = {
  name: string
  category: string
  description: string
  github_url: string
  docs_url: string
  setup_time_minutes: number
  difficulty: string
  tags: string[]
  domains: string[]
}

const COMPONENTS = (componentsData as { components: Component[] }).components

// Keyword aliases for each component name
const KEYWORD_MAP: Record<string, string[]> = {
  "Supabase Auth":   ["supabase/auth", "supabaseauth", "@supabase/auth"],
  "NextAuth.js":     ["nextauth", "next-auth", "next/auth", "authjs"],
  "Clerk":           ["@clerk/", "clerk.com", "clerkjs"],
  "Lucia Auth":      ["lucia-auth", "\"lucia\""],
  "Better Auth":     ["better-auth", "betterauth"],
  "Stripe":          ["stripe", "@stripe/"],
  "LemonSqueezy":    ["lemonsqueezy", "lemon squeezy", "@lemonsqueezy"],
  "OpenAI API":      ["openai", "gpt-4", "gpt-3", "gpt4", "gpt3", "chatgpt", "\"openai\""],
  "Anthropic Claude":["anthropic", "claude-3", "claude-2", "@anthropic-ai"],
  "Vercel AI SDK":   ["ai sdk", "@ai-sdk/", "\"ai\":", "vercel ai sdk"],
  "LangChain.js":    ["langchain", "langchainjs", "@langchain/"],
  "Pinecone":        ["pinecone", "@pinecone-database"],
  "Replicate":       ["replicate", "\"replicate\""],
  "Hugging Face":    ["huggingface", "hugging face", "@huggingface/", "transformers"],
  "Groq":            ["groq", "\"groq\""],
  "Mistral API":     ["mistral", "@mistralai/"],
  "Together AI":     ["togetherai", "together ai", "together.ai"],
  "Supabase":        ["supabase", "@supabase/supabase-js"],
  "Neon":            ["neon", "neondb", "@neondatabase/"],
  "Turso":           ["turso", "libsql", "@libsql/"],
  "Prisma":          ["prisma", "@prisma/client"],
  "Drizzle ORM":     ["drizzle", "drizzle-orm", "drizzle-kit"],
  "Upstash Redis":   ["upstash", "@upstash/redis"],
  "shadcn/ui":       ["shadcn", "shadcn/ui", "@shadcn/"],
  "Radix UI":        ["radix", "@radix-ui/"],
  "Tremor":          ["tremor", "@tremor/"],
  "Recharts":        ["recharts"],
  "Framer Motion":   ["framer-motion", "framer motion"],
  "React Hook Form": ["react-hook-form", "useform", "hookform"],
  "Zod":             ["\"zod\"", "zod.object", "zod.string", "z.object"],
  "TanStack Table":  ["@tanstack/react-table", "tanstack table"],
  "cmdk":            ["cmdk", "\"cmdk\""],
  "Resend":          ["resend", "\"resend\"", "@resend/"],
  "React Email":     ["react-email", "@react-email/"],
  "Twilio":          ["twilio", "\"twilio\""],
  "Uploadthing":     ["uploadthing", "@uploadthing/"],
  "Cloudinary":      ["cloudinary", "next-cloudinary"],
  "Cloudflare R2":   ["cloudflare r2", "@cloudflare/r2", "r2.dev"],
  "Inngest":         ["inngest", "\"inngest\""],
  "Trigger.dev":     ["trigger.dev", "triggerdotdev", "@trigger.dev/"],
  "Pusher":          ["pusher", "\"pusher\"", "pusher-js"],
  "Socket.io":       ["socket.io", "socketio", "\"socket.io\""],
  "Liveblocks":      ["liveblocks", "@liveblocks/"],
  "Excalidraw":      ["excalidraw", "@excalidraw/"],
  "tldraw":          ["tldraw", "@tldraw/"],
  "Monaco Editor":   ["monaco editor", "monaco-editor", "@monaco-editor/"],
  "Sandpack":        ["sandpack", "@codesandbox/sandpack"],
  "Zustand":         ["zustand", "\"zustand\""],
  "TanStack Query":  ["@tanstack/react-query", "react-query", "tanstack query"],
  "Posthog":         ["posthog", "posthog-js", "\"posthog-js\""],
  "Sentry":          ["sentry", "@sentry/"],
  "next-intl":       ["next-intl", "\"next-intl\""],
  "react-leaflet":   ["leaflet", "react-leaflet", "\"leaflet\""],
  "Mapbox GL JS":    ["mapbox", "mapbox-gl", "react-map-gl"],
  "Deck.gl":         ["deck.gl", "deckgl", "@deck.gl/"],
  "Vercel":          ["vercel", "\"vercel\""],
  "Railway":         ["railway"],
  "Fly.io":          ["fly.io", "flyio", "fly deploy"],
}

function matchComponents(text: string): Component[] {
  const lower = text.toLowerCase()
  const matched: Component[] = []

  for (const [componentName, keywords] of Object.entries(KEYWORD_MAP)) {
    const found = keywords.some((kw) => lower.includes(kw.toLowerCase()))
    if (found) {
      const comp = COMPONENTS.find((c) => c.name === componentName)
      if (comp && !matched.find((m) => m.name === componentName)) {
        matched.push(comp)
      }
    }
  }

  // Sort by setup_time_minutes asc
  return matched.sort((a, b) => a.setup_time_minutes - b.setup_time_minutes)
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Codefest-Analyzer/1.0)" },
    })
    return res
  } finally {
    clearTimeout(timer)
  }
}

export async function POST(req: NextRequest) {
  let url: string
  try {
    const body = await req.json()
    url = body.url?.trim()
    if (!url) throw new Error("missing url")
    new URL(url) // validate
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 })
  }

  let textContent = ""
  let source = "page"

  const parsed = new URL(url)
  const isGitHub = parsed.hostname === "github.com"

  if (isGitHub) {
    source = "github"
    const parts = parsed.pathname.split("/").filter(Boolean)
    if (parts.length >= 2) {
      const [user, repo] = parts
      const rawBase = `https://raw.githubusercontent.com/${user}/${repo}`

      // Try package.json first (most reliable for dependencies)
      for (const branch of ["main", "master"]) {
        try {
          const pkgRes = await fetchWithTimeout(`${rawBase}/${branch}/package.json`, 5000)
          if (pkgRes.ok) {
            textContent += await pkgRes.text() + "\n"
            break
          }
        } catch { /* continue */ }
      }

      // Try README
      for (const branch of ["main", "master"]) {
        try {
          const rdRes = await fetchWithTimeout(`${rawBase}/${branch}/README.md`, 5000)
          if (rdRes.ok) {
            textContent += await rdRes.text()
            break
          }
        } catch { /* continue */ }
      }
    }
  } else {
    // Generic page fetch (DevPost, etc.)
    source = parsed.hostname.includes("devpost") ? "devpost" : "page"
    try {
      const res = await fetchWithTimeout(url, 8000)
      if (!res.ok) {
        return Response.json({ error: `Could not fetch page (HTTP ${res.status})` }, { status: 400 })
      }
      const html = await res.text()
      // Strip HTML tags, decode basic entities, collapse whitespace
      textContent = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return Response.json({ error: `Could not fetch: ${message}` }, { status: 400 })
    }
  }

  if (!textContent.trim()) {
    return Response.json({ error: "No content found at that URL" }, { status: 400 })
  }

  const matched = matchComponents(textContent)
  const totalSetup = matched.reduce((sum, c) => sum + c.setup_time_minutes, 0)

  return Response.json({
    matched,
    totalSetupMinutes: totalSetup,
    source,
    textLength: textContent.length,
  })
}
