import { notFound } from "next/navigation"
import Link from "next/link"
import Script from "next/script"
import { getPost, getAllPosts, formatPostDate } from "@/lib/blog"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return { title: "Post not found" }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: `/og?title=${encodeURIComponent(post.title)}&sub=${encodeURIComponent(post.description)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/og?title=${encodeURIComponent(post.title)}&sub=${encodeURIComponent(post.description)}`],
    },
  }
}

const TAG_COLORS: Record<string, string> = {
  "auth": "#a78bfa",
  "teams": "#34d399",
  "planning": "#60a5fa",
  "resources": "#f59e0b",
  "lessons": "#fb7185",
  "strategy": "#818cf8",
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  return (
    <div className="sp-page" style={{ paddingTop: "88px", paddingBottom: "6rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Back link */}
        <Link
          href="/blog"
          style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "2.5rem" }}
        >
          ← all posts
        </Link>

        {/* Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
              {formatPostDate(post.date)}
            </span>
            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
              · {post.readingTime} min read
            </span>
            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
              · {post.author}
            </span>
          </div>

          <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: "14px" }}>
            {post.title}
          </h1>

          <p style={{ fontSize: "15px", color: "var(--sp-muted)", lineHeight: 1.7, marginBottom: "16px" }}>
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
        </header>

        <hr style={{ border: "none", borderTop: "1px solid var(--sp-border)", marginBottom: "2.5rem" }} />

        {/* Content */}
        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* EthicalAds — developer-relevant, privacy-respecting, category-filtered      */}
        {/* Replace PUBLISHER_ID once approved at ethicalads.io (need ~10k pageviews)  */}
        {/* Allowlist: developer tools, cloud, education. Financial products excluded.  */}
        {/* Alternative: Carbon Ads (carbonads.com) — often higher CPM, pickier approval */}
        {/* To switch: swap the publisher div and script src. Both use text-only format. */}
        <div style={{ margin: "3rem 0" }}>
          <div
            data-ea-publisher="PUBLISHER_ID"
            data-ea-type="text"
            data-ea-keywords="developer|cloud|devtools|education"
          />
          <Script
            src="https://media.ethicalads.io/media/client/ethicalads.min.js"
            strategy="afterInteractive"
          />
        </div>

        {/* Footer */}
        <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--sp-border)" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href="/blog"
              style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "7px", color: "var(--sp-dim)", textDecoration: "none" }}
            >
              ← all posts
            </Link>
            <Link
              href="/library"
              style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px", background: "var(--sp-brand)", color: "#000", borderRadius: "7px", fontWeight: 700, textDecoration: "none" }}
            >
              browse library →
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}
