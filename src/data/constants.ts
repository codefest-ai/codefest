// ── SHARED CONSTANTS ─────────────────────────────────────────
// Single source of truth for all UI data.
// Imported by page.tsx, workspace/page.tsx, and any future pages.

export const DOMAINS = [
  { e: "🌍", n: "Climate & Environment", d: "Carbon tracking, energy optimization, climate modeling.", tags: ["GIS", "IoT", "SDG-13"], p: 47 },
  { e: "🏥", n: "Health & Equity", d: "Patient access, mental health, rural care, public health.", tags: ["SDG-3", "accessibility", "NLP"], p: 61 },
  { e: "🏙️", n: "Civic Infrastructure", d: "Government services, transit, housing, civic engagement.", tags: ["open-data", "mapping", "SDG-11"], p: 38 },
  { e: "📚", n: "Education & Access", d: "Learning tools, skill gaps, literacy, student support.", tags: ["SDG-4", "NLP", "mobile"], p: 52 },
  { e: "💰", n: "Financial Inclusion", d: "Unbanked populations, microfinance, financial literacy.", tags: ["SDG-10", "payments", "mobile"], p: 29 },
  { e: "🌾", n: "Food Systems", d: "Food insecurity, supply chains, urban farming, nutrition.", tags: ["SDG-2", "GIS", "data"], p: 33 },
  { e: "⚡", n: "Energy & Grid", d: "Renewable integration, smart grids, energy access.", tags: ["SDG-7", "IoT", "optimization"], p: 24 },
  { e: "💧", n: "Water & Sanitation", d: "Clean water access, infrastructure monitoring, WASH.", tags: ["SDG-6", "IoT", "sensors"], p: 18 },
  { e: "🤝", n: "Community & Social", d: "Volunteering, local networks, community resilience.", tags: ["SDG-17", "realtime", "maps"], p: 41 },
  { e: "♿", n: "Accessibility", d: "Disability tech, language barriers, inclusive design.", tags: ["a11y", "NLP", "hardware"], p: 22 },
  { e: "🔒", n: "Safety & Justice", d: "Legal access, domestic safety, crisis response.", tags: ["privacy", "realtime", "SDG-16"], p: 17 },
  { e: "💼", n: "Economic Opportunity", d: "Jobs, skills, gig economy, small business.", tags: ["SDG-8", "matching", "data"], p: 35 },
]

export const PATTERNS = [
  { ev: "HACKMIT 2024", pl: "1st Place", n: "FoodBridge", d: "Real-time food rescue connecting restaurants with shelters via geolocation and route optimization.", dom: "Food Systems", stack: ["Next.js", "Supabase", "Mapbox", "Turf.js", "Twilio", "Vercel"], sdgs: ["SDG 2", "SDG 11", "SDG 17"] },
  { ev: "TREEHACKS 2024", pl: "1st Place", n: "CarbonLens", d: "Browser extension estimating product carbon footprints in real-time while shopping online.", dom: "Climate", stack: ["React", "Python FastAPI", "OpenAI API", "MongoDB", "Chrome Extensions"], sdgs: ["SDG 12", "SDG 13"] },
  { ev: "PENNAPPS 2024", pl: "2nd Place", n: "MedBridge", d: "Multilingual health intake system for underserved clinics with real-time translation and summaries.", dom: "Health Equity", stack: ["Next.js", "Anthropic Claude", "Supabase", "Vercel AI SDK", "React Hook Form"], sdgs: ["SDG 3", "SDG 10"] },
  { ev: "CALTECH 2025", pl: "1st Place", n: "GridWatch", d: "Community energy monitoring with low-cost sensors, anomaly detection, and public dashboards.", dom: "Energy", stack: ["React", "Supabase Realtime", "Python", "Recharts", "Vercel"], sdgs: ["SDG 7", "SDG 11"] },
  { ev: "NWPLUS 2025", pl: "1st Place", n: "LexPath", d: "Plain-language legal document explainer for immigrants navigating complex paperwork.", dom: "Civic", stack: ["Next.js", "OpenAI GPT-4", "Supabase", "LangChain.js", "Framer Motion"], sdgs: ["SDG 16", "SDG 10"] },
  { ev: "HACKHARVARD 2024", pl: "1st Place", n: "SkillBridge", d: "AI-powered skills gap analyzer mapping workers' skills to local jobs and micro-certifications.", dom: "Economic", stack: ["Next.js", "Vercel AI SDK", "Supabase", "Drizzle ORM", "TanStack Table"], sdgs: ["SDG 8", "SDG 4"] },
]

export const SDGS = [
  { n: "01", name: "No Poverty", p: 12 }, { n: "02", name: "Zero Hunger", p: 33 }, { n: "03", name: "Good Health", p: 61 },
  { n: "04", name: "Quality Education", p: 52 }, { n: "05", name: "Gender Equality", p: 28 }, { n: "06", name: "Clean Water", p: 18 },
  { n: "07", name: "Affordable Energy", p: 24 }, { n: "08", name: "Decent Work", p: 35 }, { n: "09", name: "Industry & Innovation", p: 44 },
  { n: "10", name: "Reduced Inequalities", p: 39 }, { n: "11", name: "Sustainable Cities", p: 38 }, { n: "13", name: "Climate Action", p: 47 },
  { n: "16", name: "Peace & Justice", p: 17 }, { n: "17", name: "Partnerships", p: 21 },
]

export const GO_QUESTIONS = [
  { key: "q1", q: "Team size?", opts: ["Solo / 2 people", "3–4 people", "5+ people"] },
  { key: "q2", q: "Primary skills?", opts: ["Frontend / React", "Full-stack / Node", "Backend / Python", "Mixed"] },
  { key: "q3", q: "Challenge domain?", opts: ["Climate / Environment", "Health / Social Impact", "Civic / Open Data", "General / Open"] },
]

export const RECS: Record<string, { title: string; desc: string; stack: string[] }> = {
  default: { title: "Next.js + Supabase + Vercel AI SDK", desc: "Fast, deployable, covers auth + DB + AI. Consistent winner across domains.", stack: ["Next.js", "Supabase Auth", "Supabase", "Vercel AI SDK", "shadcn/ui", "Vercel"] },
  climate: { title: "Next.js + Mapbox + Supabase + Recharts", desc: "Geospatial visualization is the winning pattern for climate. Judges expect to see it on a map.", stack: ["Next.js", "Mapbox", "Supabase Realtime", "Recharts", "Turf.js", "Vercel"] },
  health: { title: "Next.js + Anthropic Claude + Supabase", desc: "Claude handles multilingual and sensitive content better for health contexts. Accessibility + NLP = judges notice.", stack: ["Next.js", "Anthropic Claude", "Supabase", "Vercel AI SDK", "React Hook Form", "Zod"] },
  civic: { title: "Next.js + Open Data APIs + Recharts + Mapbox", desc: "Open data integration = instant credibility. Census API, OpenStreetMap, local government APIs.", stack: ["Next.js", "Recharts", "Mapbox", "TanStack Query", "Supabase", "Vercel"] },
}

export const CATEGORIES = ["auth", "ai", "database", "ui", "payments", "api", "devtools"]

export const CAT_COLORS: Record<string, string> = {
  auth: "#22d3ee", ai: "#a78bfa", database: "#60a5fa",
  ui: "#22c55e", payments: "#fbbf24", api: "#fb923c", devtools: "#f472b6",
}

export const DIFF_COLORS: Record<string, string> = {
  beginner: "#22c55e", intermediate: "#fbbf24", advanced: "#f472b6",
}
