// ── SHARED CONSTANTS ─────────────────────────────────────────
// Single source of truth for all UI data.
// Imported by page.tsx, workspace/page.tsx, and any future pages.

export const DOMAINS = [
  { slug: "climate",   e: "🌍", n: "Climate & Environment", d: "Carbon tracking, energy optimization, climate modeling.", tags: ["GIS", "IoT", "SDG-13"], p: 47 },
  { slug: "health",    e: "🏥", n: "Health & Equity", d: "Patient access, mental health, rural care, public health.", tags: ["SDG-3", "accessibility", "NLP"], p: 61 },
  { slug: "civic",     e: "🏙️", n: "Civic Infrastructure", d: "Government services, transit, housing, civic engagement.", tags: ["open-data", "mapping", "SDG-11"], p: 38 },
  { slug: "education", e: "📚", n: "Education & Access", d: "Learning tools, skill gaps, literacy, student support.", tags: ["SDG-4", "NLP", "mobile"], p: 52 },
  { slug: "finance",   e: "💰", n: "Financial Inclusion", d: "Unbanked populations, microfinance, financial literacy.", tags: ["SDG-10", "payments", "mobile"], p: 29 },
  { slug: "food",      e: "🌾", n: "Food Systems", d: "Food insecurity, supply chains, urban farming, nutrition.", tags: ["SDG-2", "GIS", "data"], p: 33 },
  { slug: "other",     e: "⚡", n: "Energy & Grid", d: "Renewable integration, smart grids, energy access.", tags: ["SDG-7", "IoT", "optimization"], p: 24 },
  { slug: "other",     e: "💧", n: "Water & Sanitation", d: "Clean water access, infrastructure monitoring, WASH.", tags: ["SDG-6", "IoT", "sensors"], p: 18 },
  { slug: "civic",     e: "🤝", n: "Community & Social", d: "Volunteering, local networks, community resilience.", tags: ["SDG-17", "realtime", "maps"], p: 41 },
  { slug: "other",     e: "♿", n: "Accessibility", d: "Disability tech, language barriers, inclusive design.", tags: ["a11y", "NLP", "hardware"], p: 22 },
  { slug: "safety",    e: "🔒", n: "Safety & Justice", d: "Legal access, domestic safety, crisis response.", tags: ["privacy", "realtime", "SDG-16"], p: 17 },
  { slug: "finance",   e: "💼", n: "Economic Opportunity", d: "Jobs, skills, gig economy, small business.", tags: ["SDG-8", "matching", "data"], p: 35 },
]

export const PATTERNS = [
  { ev: "HACKMIT 2024", pl: "1st Place", n: "FoodBridge", d: "Real-time food rescue connecting restaurants with shelters via geolocation and route optimization.", dom: "Food Systems", domainSlug: "food", stack: ["Next.js", "Supabase", "Mapbox", "Turf.js", "Twilio", "Vercel"], sdgs: ["SDG 2", "SDG 11", "SDG 17"], href: "https://devpost.com/search?query=FoodBridge+hackmit" },
  { ev: "TREEHACKS 2024", pl: "1st Place", n: "CarbonLens", d: "Browser extension estimating product carbon footprints in real-time while shopping online.", dom: "Climate", domainSlug: "climate", stack: ["React", "Python FastAPI", "OpenAI API", "MongoDB", "Chrome Extensions"], sdgs: ["SDG 12", "SDG 13"], href: "https://devpost.com/search?query=CarbonLens+treehacks" },
  { ev: "PENNAPPS 2024", pl: "2nd Place", n: "MedBridge", d: "Multilingual health intake system for underserved clinics with real-time translation and summaries.", dom: "Health Equity", domainSlug: "health", stack: ["Next.js", "Anthropic Claude", "Supabase", "Vercel AI SDK", "React Hook Form"], sdgs: ["SDG 3", "SDG 10"], href: "https://devpost.com/search?query=MedBridge+pennapps" },
  { ev: "CALTECH 2025", pl: "1st Place", n: "GridWatch", d: "Community energy monitoring with low-cost sensors, anomaly detection, and public dashboards.", dom: "Energy", domainSlug: "civic", stack: ["React", "Supabase Realtime", "Python", "Recharts", "Vercel"], sdgs: ["SDG 7", "SDG 11"], href: "https://devpost.com/search?query=GridWatch+caltech" },
  { ev: "NWPLUS 2025", pl: "1st Place", n: "LexPath", d: "Plain-language legal document explainer for immigrants navigating complex paperwork.", dom: "Civic", domainSlug: "civic", stack: ["Next.js", "OpenAI GPT-4", "Supabase", "LangChain.js", "Framer Motion"], sdgs: ["SDG 16", "SDG 10"], href: "https://devpost.com/search?query=LexPath+nwplus" },
  { ev: "HACKHARVARD 2024", pl: "1st Place", n: "SkillBridge", d: "AI-powered skills gap analyzer mapping workers' skills to local jobs and micro-certifications.", dom: "Economic", domainSlug: "finance", stack: ["Next.js", "Vercel AI SDK", "Supabase", "Drizzle ORM", "TanStack Table"], sdgs: ["SDG 8", "SDG 4"], href: "https://devpost.com/search?query=SkillBridge+hackharvard" },
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

export const AUDIENCE_ARCHETYPES = [
  {
    id: "student",
    icon: "🎓",
    label: "Student / First-timer",
    desc: "First hackathon or new to building. Learning as you go.",
    prompt: "What problem do you wish someone had already solved for your community?",
    hint: "Think about a frustration you've personally experienced or seen others struggle with.",
  },
  {
    id: "developer",
    icon: "💻",
    label: "Developer / Technical",
    desc: "Comfortable with code. Want to ship fast and impress judges.",
    prompt: "What broken system have you noticed that could be fixed with the right data or API?",
    hint: "Think about inefficiencies you've seen in industries, services, or workflows.",
  },
  {
    id: "designer",
    icon: "🎨",
    label: "Designer / Product Thinker",
    desc: "Focused on user experience and problem framing, not just code.",
    prompt: "Who is underserved in your community, and what does their frustration look like day-to-day?",
    hint: "Describe a real person. What do they try to do? Where do they get stuck?",
  },
  {
    id: "expert",
    icon: "🏥",
    label: "Domain Expert / Non-technical",
    desc: "Deep knowledge in a field — health, law, education, environment.",
    prompt: "What do you see in your field that technology hasn't touched yet — but should?",
    hint: "You have knowledge that most hackers don't. That gap is your superpower.",
  },
]

export const PROBLEM_FRAMES = [
  "I want to help ___ do ___ more easily.",
  "The barrier is ___ — and most tools ignore it.",
  "If someone built ___, it would save ___ hours per week.",
  "The existing solution fails because ___.",
  "People in ___ can't access ___ because ___.",
]

export const CATEGORY_META: Record<string, {
  label: string; icon: string; color: string;
  tagline: string; why: string; pitfall: string; tip: string;
}> = {
  auth: {
    label: "Authentication", icon: "🔐", color: "#22d3ee",
    tagline: "The setup killer. Get this right in the first 30 minutes.",
    why: "Every hackathon project that needs user accounts lives or dies on auth. Wrong choice means hours of debugging OAuth redirects at 2am instead of building features. The good news: modern auth providers handle the hard parts for you — Google sign-in, session management, email magic links — in under 30 minutes if you pick the right tool.",
    pitfall: "Don't roll your own. Don't start with email+password unless it's core to your concept. Don't use two auth providers. Pick one and commit.",
    tip: "Supabase Auth if you're already using Supabase. Clerk if you want the fastest drop-in with the best UI out of the box. NextAuth if you're deep in the Next.js ecosystem and want full control.",
  },
  ai: {
    label: "AI & LLMs", icon: "🤖", color: "#a78bfa",
    tagline: "The feature judges remember. The differentiator that wins tracks.",
    why: "AI features are what separate 'cool project' from 'this could be a real product.' Judges have seen dashboards. They've seen CRUD apps. An LLM integration that does something genuinely useful — explains a medical record in plain language, translates a legal document, routes a crisis to the right resource — that's what gets remembered. The barrier to entry is now low enough that not having an AI layer is a missed opportunity.",
    pitfall: "Don't add AI as a gimmick. 'We used ChatGPT to generate descriptions' isn't a feature. The AI should solve a real problem that would be hard to solve any other way.",
    tip: "Claude for nuanced, sensitive, or multilingual content (health, legal, social). GPT-4o for speed and general tasks. HuggingFace for open-source and specialized models. Vercel AI SDK if you want streaming built-in.",
  },
  database: {
    label: "Database", icon: "🗄️", color: "#60a5fa",
    tagline: "Your data layer. Pick once and don't look back.",
    why: "The database decision shapes everything else — your queries, your auth, your realtime features, your deployment. Most hackathon teams overthink this. You don't need a distributed database. You need something that's live, has a free tier, and lets you write SQL or call an ORM without fighting it.",
    pitfall: "Don't pick a database that requires you to manage infrastructure during the hackathon. Don't use multiple databases. Don't add an ORM if you're already comfortable with raw SQL in your provider's client.",
    tip: "Supabase if you want Postgres + auth + realtime + storage all in one. Neon if you just want serverless Postgres. PlanetScale if you're on MySQL. Add Prisma or Drizzle ORM only if you're doing complex relational logic that benefits from type safety.",
  },
  ui: {
    label: "UI Components", icon: "🎨", color: "#22c55e",
    tagline: "Don't design from scratch. Ship something polished in hours.",
    why: "Judges form an impression in the first 10 seconds of a demo. A polished UI signals that you know what you're doing, even if the backend is still being held together with duct tape. Component libraries give you that polish without spending half the hackathon on CSS. Tailwind handles spacing and layout. shadcn/ui gives you production-quality components you own.",
    pitfall: "Don't spend more than 2 hours on UI before your core feature works end-to-end. Beautiful empty state > buggy feature.",
    tip: "Tailwind + shadcn/ui is the dominant pattern in winning projects. Framer Motion for transitions if you have time and they add clarity. Recharts or Chart.js for data visualization — judges love a good chart.",
  },
  payments: {
    label: "Payments", icon: "💳", color: "#fbbf24",
    tagline: "Only add this if payments are core to your value prop.",
    why: "Payments are a credibility signal when they're core to the concept — a marketplace, a subscription tool, a fintech project. Judges understand the business model immediately when they see Stripe integrated correctly. But payment integration is time-intensive and error-prone under time pressure. Only add it if the project doesn't make sense without it.",
    pitfall: "Don't add payments as an afterthought to show 'monetization potential.' It takes time you don't have and adds complexity to your demo. Use Stripe's test mode — never real cards in a hackathon.",
    tip: "Stripe for everything if you need card payments. LemonSqueezy if you want a simpler API for digital products. Always use test mode. Always have a fallback demo flow if the payment integration breaks during the presentation.",
  },
  services: {
    label: "Services & APIs", icon: "🔌", color: "#fb923c",
    tagline: "Your secret weapon. A great API integration beats building from scratch.",
    why: "The best hackathon projects aren't built from scratch — they're assembled from the right pieces. A team that knows how to find and integrate the right API can build something in 12 hours that would take weeks to build without it. Communication APIs (Twilio, Resend) make user-facing features real. Storage, search, and background job services let you skip building infrastructure entirely.",
    pitfall: "Don't integrate a service before you've verified it works in your language/framework. Don't rely on a single third-party API for your core demo — have a fallback if it's down.",
    tip: "Check rate limits before you commit to an API during a hackathon. Many free tiers are generous but have low rate limits that will bite you during a live demo. Test with your actual expected data volume.",
  },
  tooling: {
    label: "Developer Tooling", icon: "⚙️", color: "#f472b6",
    tagline: "Ship on day one. No excuses for 'it only works locally.'",
    why: "A project that's deployed beats a project on localhost every single time. Judges want to click a link. Vercel gives you continuous deployment from GitHub in one click — every push deploys automatically. TypeScript catches errors before runtime. Zod validates your data at the edges. These tools aren't glamorous but they're the difference between a demo that works and one that crashes.",
    pitfall: "Don't leave deployment for the last hour. Deploy an empty skeleton on day one. That way you're always shipping to a live URL and you catch deployment issues early instead of at 11pm before the deadline.",
    tip: "Vercel for Next.js, always. Railway or Render if you need a backend with persistent state. Bun or tsx for fast local TypeScript execution. Add TypeScript and Zod from the start — the time cost is minimal and the error-catching is worth it.",
  },
  maps: {
    label: "Maps & Geospatial", icon: "🗺️", color: "#34d399",
    tagline: "Put it on a map. Judges remember what they can see.",
    why: "Geographic visualization turns abstract data into something anyone can understand immediately. Climate, food, civic, transit, health — almost every impact domain has a location component. A map makes your project's scope and impact legible in seconds. Winning civic and climate projects almost always have a map.",
    pitfall: "Don't add a map just to have a map. If location isn't core to your problem, skip it. A bad map clutters the demo more than no map.",
    tip: "react-leaflet for quick, open-source maps with no API key needed. Mapbox GL JS when you need custom styling or vector tiles. Deck.gl for large datasets or 3D visualization. Start with react-leaflet — you can swap later if you need more power.",
  },
  deploy: {
    label: "Deployment", icon: "🚀", color: "#818cf8",
    tagline: "Live URL beats localhost every time.",
    why: "Judges want to tap a link, not watch you share your screen with a local server. Getting deployed in the first hour of the hackathon means every subsequent push goes live automatically. It also catches environment issues early — before they surface at 11pm the night before judging.",
    pitfall: "Don't wait until the last hour to deploy. Deploy an empty shell on day one. The first deployment is always the hardest — get it out of the way early.",
    tip: "Vercel is the default for Next.js — zero config, free tier, preview deployments per branch. Railway for anything that needs a persistent backend or worker process. Fly.io if you need containers or custom runtimes.",
  },
}

export const CATEGORIES = ["auth", "ai", "database", "ui", "payments", "services", "tooling", "maps", "deploy"]

export const CAT_COLORS: Record<string, string> = {
  auth: "#22d3ee", ai: "#a78bfa", database: "#60a5fa",
  ui: "#22c55e", payments: "#fbbf24", services: "#fb923c", tooling: "#f472b6",
  maps: "#34d399", deploy: "#818cf8",
}

export const DIFF_COLORS: Record<string, string> = {
  beginner: "#22c55e", intermediate: "#fbbf24", advanced: "#f472b6",
}
