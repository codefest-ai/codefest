#!/usr/bin/env node
/**
 * fetch-hackathons.js
 *
 * Fetches upcoming hackathons from the Hack Club public API and
 * updates src/data/hackathons.json with the next 8 events.
 *
 * Source: https://hackathons.hackclub.com/api/hackathons.json
 * Run manually: node scripts/fetch-hackathons.js
 * Run via CI:   GitHub Actions (see .github/workflows/update-hackathons.yml)
 */

const fs = require("fs")
const path = require("path")

const OUTPUT_PATH = path.join(__dirname, "../src/data/hackathons.json")
const API_URL = "https://hackathons.hackclub.com/api/hackathons.json"
const MAX_EVENTS = 8

// Map HackClub format tags to our format labels
function parseFormat(location) {
  if (!location) return "in-person"
  const l = location.toLowerCase()
  if (l.includes("online") || l.includes("virtual") || l.includes("remote")) return "virtual"
  return "in-person"
}

// Format a date string like "2026-03-15" → "Mar 15, 2026"
function formatDate(iso) {
  if (!iso) return "TBD"
  try {
    const d = new Date(iso + "T12:00:00Z")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
  } catch {
    return iso
  }
}

// Format a date range "Mar 14–16, 2026"
function formatDateRange(start, end) {
  if (!start) return "TBD"
  try {
    const s = new Date(start + "T12:00:00Z")
    const e = end ? new Date(end + "T12:00:00Z") : null
    const opts = { timeZone: "UTC" }
    const month = s.toLocaleDateString("en-US", { month: "short", ...opts })
    const year = s.toLocaleDateString("en-US", { year: "numeric", ...opts })
    const startDay = s.toLocaleDateString("en-US", { day: "numeric", ...opts })
    if (!e || s.toDateString() === e.toDateString()) return `${month} ${startDay}, ${year}`
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      const endDay = e.toLocaleDateString("en-US", { day: "numeric", ...opts })
      return `${month} ${startDay}–${endDay}, ${year}`
    }
    return `${formatDate(start)} – ${formatDate(end)}`
  } catch {
    return start
  }
}

// Infer whether registration is likely open (within 60 days of start)
function isRegistrationOpen(startIso) {
  if (!startIso) return false
  const start = new Date(startIso)
  const now = new Date()
  const daysUntil = (start - now) / (1000 * 60 * 60 * 24)
  return daysUntil > 0 && daysUntil <= 60
}

async function main() {
  console.log("Fetching hackathons from Hack Club API...")

  let data
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data = await res.json()
  } catch (err) {
    console.error("Failed to fetch:", err.message)
    process.exit(1)
  }

  const now = new Date()

  // Filter to upcoming events only, sort by start date
  const upcoming = data
    .filter((h) => {
      if (!h.start) return false
      return new Date(h.start) > now
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, MAX_EVENTS)

  if (upcoming.length === 0) {
    console.log("No upcoming events found. Keeping existing data.")
    process.exit(0)
  }

  const hackathons = upcoming.map((h) => ({
    name: h.name,
    org: h.organization || h.name,
    date: formatDateRange(h.start, h.end),
    format: parseFormat(h.location),
    location: h.location || "TBD",
    href: h.website || h.url || "#",
    domains: h.themes || ["Open"],
    registrationOpen: isRegistrationOpen(h.start),
  }))

  const output = { hackathons, updatedAt: new Date().toISOString() }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n")

  console.log(`✓ Updated ${OUTPUT_PATH} with ${hackathons.length} events:`)
  hackathons.forEach((h) => console.log(`  · ${h.name} (${h.date})`))
}

main()
