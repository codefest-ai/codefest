# HalalJobs.ai — Product Architecture (v3, AAOIFI-aligned)

*March 7, 2026 — Updated for AAOIFI-aligned screening (replaces custom halal scores)*

---

## The Insight

The original build had 30 hand-picked jobs with halal scores from 1–5. That's the wrong product.

The right product is: **show the real job market, screen employers using AAOIFI-aligned criteria, let the user filter based on their own values.**

Analogy: A halal food app doesn't only show halal products. It shows the whole supermarket — every product tagged with its ingredients and certifications — so YOU can decide what meets YOUR standard. You need to see the haram stuff too, because that's how filtering works. The product is the filter, not the curation.

## Why AAOIFI, Not Custom Scores

Custom "halal scores" (1–5) would be bid'ah (religious innovation). We don't have the scholarship to invent a scoring system. Instead, we use **AAOIFI Standard 21** — the same established criteria that:

- **IFG (Islamic Finance Guru)** uses for stock screening
- **Zoya** uses for halal stock screening
- **Musaffa** uses for their compliance ratings
- **Islamicly** uses for investment screening

We've adapted these from stock screening to employer screening. Same criteria, different application domain. The community already trusts this framework.

---

## Screening Statuses

Every employer gets one of four statuses:

| Status | Meaning |
|--------|---------|
| **Compliant** | Passes all AAOIFI-style screens — core business permissible, <5% non-permissible income |
| **Doubtful** | Has activities requiring review — may pass depending on standard and madhhab |
| **Non-Compliant** | Core business involves impermissible activities (alcohol, gambling, etc.) |
| **Not Screened** | Insufficient data to classify |

### AAOIFI Screening Criteria (Standard 21)

1. **Non-permissible income** — Revenue from haram sources < 5% of total
2. **Interest-based income** — Revenue from riba < 5% of total
3. **Core business activity** — Must be inherently permissible

---

## Data Model

### Employer (screened at company level)
```json
{
  "id": "microsoft",
  "name": "Microsoft",
  "industry": "technology",
  "screening_status": "COMPLIANT",
  "activities": [],
  "positives": [],
  "company_type": "conventional",
  "revenue_sources": [
    { "source": "Cloud services (Azure)", "pct": 40 },
    { "source": "Software licensing", "pct": 35 },
    { "source": "Hardware", "pct": 15 },
    { "source": "Gaming", "pct": 10 }
  ],
  "employee_count": 221000,
  "hq_country": "US",
  "publicly_traded": true
}
```

### Job (inherits employer screening)
```json
{
  "id": "j-microsoft-senior-swe",
  "slug": "senior-software-engineer-microsoft",
  "employer_id": "microsoft",
  "title": "Senior Software Engineer",
  "location": "Redmond, WA",
  "remote": true,
  "type": "Full-time",
  "role_concerns": [],
  "description": "...",
  "tags": ["python", "azure", "distributed-systems"]
}
```

### Activity Tags (factual, not judgments)
Activities with `screening_impact: "fail"` → auto non-compliant:
- `alcohol_production`, `gambling`, `adult_content`, `pork_processing`

Activities with `screening_impact: "review"` → doubtful:
- `interest_based_revenue`, `alcohol_service`, `weapons_manufacturing`, `defense_contractor`, `conventional_insurance`, `tobacco`, `entertainment_mixed`, `pharmaceutical_mixed`, `speculation_heavy`

---

## Scraping Pipeline

### Phase 1 (Current): Seed Data
- 47 classified employers, 120 jobs
- Manually researched, factual classification
- All TypeScript, Next.js App Router

### Phase 2: JobSpy Integration
- Python script using `python-jobspy` library
- Scrapes LinkedIn, Indeed, Glassdoor, ZipRecruiter
- Matches to existing employer database
- Generates stubs for unclassified employers
- Script at: `scripts/scrape_jobs.py`

### Phase 3: Automated Pipeline
- Cron job scraping new jobs daily
- Employer classification queue for new companies
- Community submission for corrections
- API for real-time scraping on demand

---

## Tech Stack

- **Frontend**: Next.js 14 App Router + Tailwind CSS v4
- **Screening**: TypeScript types in `screening.ts` (AAOIFI-aligned)
- **Data**: JSON files (employers.json, jobs.json) → eventually PostgreSQL
- **Scraping**: Python + JobSpy → JSON pipeline
- **Hosting**: Vercel
- **Domain**: halaljobs.ai (TBD)

---

## MVP Feature Set (Current)

- [x] 120 jobs across 47 screened employers
- [x] AAOIFI-aligned screening statuses (Compliant/Doubtful/Non-Compliant/Not Screened)
- [x] Filter by screening status, industry, job type
- [x] Exclude specific activities (interest-based revenue, alcohol, etc.)
- [x] Activity badges with screening impact indicators
- [x] Revenue source breakdown per employer
- [x] About page with methodology explanation
- [x] Scraping pipeline prototype
- [ ] Deploy to Vercel
- [ ] Domain setup (halaljobs.ai)
- [ ] Email routing (hello@halaljobs.ai)
- [ ] Ko-fi/donate integration

---

*Updated: March 7, 2026*
*AAOIFI-aligned. Community-trusted frameworks. No bid'ah.*
