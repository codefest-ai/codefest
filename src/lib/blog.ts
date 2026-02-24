import fs from "fs"
import path from "path"

// ── Types ──────────────────────────────────────────────────────

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string          // "YYYY-MM-DD"
  tags: string[]
  author: string
  readingTime: number   // minutes (estimated)
}

export type Post = PostMeta & {
  content: string       // raw markdown
  html: string          // rendered HTML
}

// ── Paths ──────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), "src/content/posts")

// ── Frontmatter parser ─────────────────────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }

  const meta: Record<string, string> = {}
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":")
    if (colon < 0) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "")
    meta[key] = val
  }
  return { meta, body: match[2] }
}

// ── Lightweight markdown → HTML ────────────────────────────────

function markdownToHtml(md: string): string {
  let html = md

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    return `<pre class="blog-code" data-lang="${lang}"><code>${escaped.trim()}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-img" />')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-link">$1</a>')

  // Bold + italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>")

  // Headings (process h4 → h1 to avoid conflicts)
  html = html.replace(/^#### (.+)$/gm, '<h4 class="blog-h4">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>')

  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote class="blog-blockquote">$1</blockquote>')

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr class=\"blog-hr\" />")

  // Unordered list (collect consecutive list items)
  html = html.replace(/((?:^[-*] .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map(l => `<li>${l.replace(/^[-*] /, "")}</li>`).join("")
    return `<ul class="blog-ul">${items}</ul>`
  })

  // Ordered list
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map(l => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("")
    return `<ol class="blog-ol">${items}</ol>`
  })

  // Paragraphs: wrap lines not already wrapped in a block tag
  const blockTags = /^<(h[1-6]|ul|ol|li|blockquote|pre|hr|img)/
  html = html
    .split(/\n\n+/)
    .map(para => {
      const trimmed = para.trim()
      if (!trimmed) return ""
      if (blockTags.test(trimmed)) return trimmed
      return `<p class="blog-p">${trimmed.replace(/\n/g, " ")}</p>`
    })
    .filter(Boolean)
    .join("\n")

  return html
}

// ── Reading time estimate ──────────────────────────────────────

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

// ── Public API ─────────────────────────────────────────────────

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".md"))
    .map(filename => {
      const slug = filename.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8")
      const { meta, body } = parseFrontmatter(raw)
      return {
        slug,
        title: meta.title ?? slug,
        description: meta.description ?? "",
        date: meta.date ?? "2026-01-01",
        tags: meta.tags ? meta.tags.split(",").map(t => t.trim()) : [],
        author: meta.author ?? "codefest.ai",
        readingTime: estimateReadingTime(body),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf8")
  const { meta, body } = parseFrontmatter(raw)

  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? "",
    date: meta.date ?? "2026-01-01",
    tags: meta.tags ? meta.tags.split(",").map(t => t.trim()) : [],
    author: meta.author ?? "codefest.ai",
    readingTime: estimateReadingTime(body),
    content: body,
    html: markdownToHtml(body),
  }
}

export function formatPostDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z")
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}
