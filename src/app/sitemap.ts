import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import componentsData from "@/data/components_seed.json"

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://codefest.ai"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/library`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/workspace`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/guide`, lastModified: new Date("2026-02-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/organizers`, lastModified: new Date("2026-02-22"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/about`, lastModified: new Date("2026-02-22"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/showcase`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/teams`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/competitions`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/showcase/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  // Component library pages
  const components = (componentsData as { components: { name: string }[] }).components
  const componentPages: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${base}/library/${toSlug(c.name)}`,
    lastModified: new Date("2026-02-22"),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  // Blog post pages
  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date + "T12:00:00Z"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...componentPages, ...blogPages]
}
