import { MetadataRoute } from "next"
import jobsData from "@/data/jobs.json"
import employersData from "@/data/employers.json"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://halaljobs.ai"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/employers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/donate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ]

  // Job pages
  const jobPages: MetadataRoute.Sitemap = jobsData.jobs.map(job => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.posted),
    changeFrequency: "weekly" as const,
    priority: job.featured ? 0.8 : 0.7,
  }))

  // Employer pages
  const employerPages: MetadataRoute.Sitemap = employersData.employers.map(emp => ({
    url: `${baseUrl}/employers/${emp.id}`,
    lastModified: new Date(emp.last_reviewed),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...jobPages, ...employerPages]
}
