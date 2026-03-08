# HalalJobs.ai

See the job market through your values. Every employer screened using AAOIFI-aligned criteria — you decide what fits.

## What is this?

HalalJobs.ai shows the **entire job market**, not just a curated list of "approved" jobs. Every employer is screened using AAOIFI Standard 21 criteria — the same framework trusted by IFG, Zoya, Musaffa, and other Islamic finance platforms — adapted from stock screening to employment.

Users see the screening status, flagged activities, and positive indicators for each employer, then filter based on their own values, madhhab, and circumstances.

## Screening Statuses

| Status | Meaning |
|--------|---------|
| **Compliant** | Core business permissible, non-permissible income < 5% |
| **Doubtful** | Some activities require scholarly review |
| **Non-Compliant** | Core business involves prohibited activities |
| **Not Yet Screened** | Employer listed but not yet reviewed |

## Tech Stack

- **Framework:** Next.js 16 (App Router, SSG)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Data:** Static JSON (jobs + employers)
- **Hosting:** Vercel (planned)

## Pages

- `/` — Landing page with featured jobs and how-it-works
- `/jobs` — Full job listing with filters (screening status, industry, activities, job type) and pagination
- `/jobs/[slug]` — Job detail with employer screening breakdown + JSON-LD
- `/employers` — Searchable employer directory
- `/employers/[id]` — Employer detail with full screening info and all jobs
- `/about` — Methodology, AAOIFI criteria, screening statuses, activity definitions
- `/suggest` — Community job suggestion form
- `/donate` — Sadaqah support page

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building

```bash
npm run build
```

Generates 175+ static pages at build time.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Shared UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   ├── ScreeningBadge.tsx
│   └── ConcernBadges.tsx
└── data/
    ├── screening.ts  # AAOIFI-aligned types, criteria, activities
    ├── jobs.json     # Job listings
    └── employers.json # Employer data with screening results
```

## Principles

- **Show everything, filter by values** — we don't hide jobs, we label them
- **Established standards** — AAOIFI-aligned criteria, not custom invention
- **Transparent** — every screening decision is visible with its reasoning
- **Free, always** — no paywalls, no data selling, no pay-to-rank

## Contributing

Know a job we should list? Use the [suggestion form](/suggest) or email hello@halaljobs.ai.

## License

All rights reserved. © 2026 HalalJobs.ai
