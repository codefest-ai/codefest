import { getAllPosts } from "@/lib/blog"
import { NextResponse } from "next/server"

const SITE_URL = "https://codefest.ai"

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map(post => {
      const url = `${SITE_URL}/blog/${post.slug}`
      const pubDate = new Date(post.date + "T12:00:00Z").toUTCString()
      const categories = post.tags.map(t => `<category>${t}</category>`).join("")
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@codefest.ai (${post.author})</author>
      ${categories}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Codefest.ai — Hackathon Insights</title>
    <description>Guides, patterns, and hard-won lessons for the person building at 2am.</description>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${SITE_URL}/og</url>
      <title>Codefest.ai</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
