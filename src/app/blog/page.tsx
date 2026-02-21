import Link from "next/link"
import { getAllPosts, formatPostDate } from "@/lib/blog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog — Hackathon Insights",
  description: "Guides, patterns, and lessons from the hackathon ecosystem. Written for the person building at 2am.",
}

const TAG_COLORS: Record<string, string> = {
  "auth": "#a78bfa",
  "teams": "#34d399",
  "planning": "#60a5fa",
  "resources": "#f59e0b",
  "lessons": "#fb7185",
  "strategy": "#818cf8",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="sp-page" style={{ paddingTop: "88px", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>
            field notes
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: "10px" }}>
            Hackathon Insights
          </h1>
          <p style={{ fontSize: "14px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
            Guides, patterns, and hard-won lessons for the person building at 2am.
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--sp-dim)", fontFamily: "var(--sp-mono)", fontSize: "12px" }}>
            no posts yet — check back soon
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: "block",
                  padding: "1.75rem 0",
                  borderTop: i === 0 ? "1px solid var(--sp-border)" : "none",
                  borderBottom: "1px solid var(--sp-border)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 0.15s",
                }}
                className="blog-list-item"
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                    {formatPostDate(post.date)}
                  </span>
                  <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                    · {post.readingTime} min read
                  </span>
                </div>

                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: "6px" }}>
                  {post.title}
                </h2>

                <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6, marginBottom: "10px" }}>
                  {post.description}
                </p>

                {post.tags.length > 0 && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "var(--sp-mono)",
                          fontSize: "9px",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background: "var(--sp-surface2)",
                          color: TAG_COLORS[tag] ?? "var(--sp-dim)",
                          textTransform: "lowercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
