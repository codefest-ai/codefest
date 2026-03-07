# HalalJobs.ai — Product Architecture (v2, corrected)

*March 5, 2026 — This replaces the original "curated directory" approach.*

---

## The Insight

The original build had 30 hand-picked jobs with halal scores from 1–5. That's the wrong product.

The right product is: **show the real job market, classify employers on factual criteria, let the user filter based on their own values.**

Analogy: A halal food app doesn't only show halal products. It shows the whole supermarket — every product tagged with its ingredients and certifications — so YOU can decide what meets YOUR standard. You need to see the haram stuff too, because that's how filtering works. The product is the filter, not the curation.

This also solves the credentials problem. We're not scholars. We shouldn't be issuing scores. What we CAN do is surface facts: "This company earns 45% of revenue from interest-based lending." That's a factual statement anyone can make. The user applies their own madhhab, their own risk tolerance, their own judgment.

---

## Product Positioning

**Old (wrong):** "Every job rated for halal compliance."
**New (right):** "See the real job market through your values."

We are not rating. We are classifying. The user is not consuming our opinion. They're using our data to form their own.

**Not a fatwa. Not even a rating. Just the facts you need.**

---

## Data Model

### Employers (first-class entity)

This is the key insight: **halal classification lives at the employer level, not the job level.** You rate JPMorgan once. Every job they post inherits that classification.

```json
{
  "id": "jpmorgan-chase",
  "name": "JPMorgan Chase",
  "industry": "financial_services",
  "sub_industry": "investment_banking",
  "revenue_sources": [
    { "source": "interest_based_lending", "pct": 45 },
    { "source": "investment_banking_fees", "pct": 25 },
    { "source": "asset_management", "pct": 20 },
    { "source": "trading", "pct": 10 }
  ],
  "concerns": ["interest_based_revenue", "conventional_finance"],
  "positives": [],
  "certifications": [],
  "company_type": "conventional",
  "publicly_traded": true,
  "employee_count": 300000,
  "hq_country": "US",
  "careers_url": "https://careers.jpmorgan.com",
  "classification_source": "public_filings",
  "last_reviewed": "2026-03-05"
}
```

```json
{
  "id": "islamic-relief",
  "name": "Islamic Relief Worldwide",
  "industry": "nonprofit",
  "sub_industry": "humanitarian",
  "revenue_sources": [
    { "source": "charitable_donations", "pct": 85 },
    { "source": "grants", "pct": 15 }
  ],
  "concerns": [],
  "positives": ["islamic_mission", "humanitarian", "zakat_eligible"],
  "certifications": ["islamic_org"],
  "company_type": "islamic_org",
  "publicly_traded": false,
  "employee_count": 3000,
  "hq_country": "UK",
  "careers_url": "https://www.islamic-relief.org/careers",
  "classification_source": "public_information",
  "last_reviewed": "2026-03-05"
}
```

### Concern Taxonomy

Factual tags, not opinions:

| Concern ID | Label | Description |
|---|---|---|
| `interest_based_revenue` | Interest-based revenue | Company earns from riba/conventional interest |
| `alcohol_production` | Alcohol production | Company produces alcoholic beverages |
| `alcohol_service` | Alcohol service | Company serves/distributes alcohol (restaurants, retailers) |
| `gambling` | Gambling | Company operates or facilitates gambling |
| `weapons_manufacturing` | Weapons manufacturing | Company manufactures weapons/munitions |
| `defense_contractor` | Defense contractor | Works with military but not direct weapons |
| `adult_content` | Adult content | Company produces or distributes adult content |
| `conventional_insurance` | Conventional insurance | Non-takaful insurance |
| `tobacco` | Tobacco | Company produces tobacco products |
| `pork_processing` | Pork processing | Company involved in pork production/processing |
| `entertainment_mixed` | Mixed entertainment | Produces entertainment that may include haram content |
| `pharmaceutical_mixed` | Mixed pharmaceutical | May involve haram-derived ingredients |
| `speculation_heavy` | Heavy speculation | Revenue significantly from speculative trading |

### Positive Tags

| Tag ID | Label | Description |
|---|---|---|
| `islamic_mission` | Islamic mission | Organization has an explicitly Islamic mission |
| `halal_certified` | Halal certified | Company/product holds halal certification |
| `zakat_eligible` | Zakat eligible | Organization is zakat-eligible |
| `humanitarian` | Humanitarian | Humanitarian / social good mission |
| `shariah_compliant` | Shariah compliant | Verified shariah-compliant operations |
| `muslim_founded` | Muslim founded | Founded by Muslim(s) |
| `ethical_finance` | Ethical finance | Islamic or ethical finance model |

### Jobs

Jobs are lightweight — they inherit employer classification:

```json
{
  "id": "job-001",
  "employer_id": "jpmorgan-chase",
  "title": "Software Engineer",
  "location": "New York, NY",
  "remote": false,
  "type": "Full-time",
  "salary_min": 120000,
  "salary_max": 180000,
  "description": "Build trading infrastructure...",
  "role_concerns": ["direct_involvement_interest_products"],
  "posted": "2026-03-01",
  "source_url": "https://careers.jpmorgan.com/...",
  "source": "career_page"
}
```

Note `role_concerns` — some roles within an otherwise neutral employer have specific issues (e.g., a marketing role at a tech company where you'd market a product that includes gambling features). Most jobs inherit only the employer-level concerns.

### User Preferences (v2, when we have accounts)

```json
{
  "madhhab": "hanafi",
  "excluded_concerns": [
    "interest_based_revenue",
    "alcohol_production",
    "gambling",
    "weapons_manufacturing"
  ],
  "concern_thresholds": {
    "interest_based_revenue": 5
  },
  "preferred_industries": ["technology", "healthcare"],
  "preferred_locations": ["Remote"],
  "preferred_types": ["Full-time"]
}
```

For v1 (no accounts): all filtering happens client-side with checkboxes. No login required.

---

## Filter UI (replaces halal scores)

### Sidebar Filters

**Exclude concerns:**
☐ Interest-based finance
☐ Alcohol
☐ Gambling
☐ Weapons / Defense
☐ Adult content
☐ Tobacco
☐ Conventional insurance
☐ Pork

**Show only:**
☐ Islamic organizations
☐ Halal-certified employers
☐ Muslim-founded companies

**Your madhhab** (affects default filter presets)
○ Not specified
○ Hanafi
○ Maliki
○ Shafi'i
○ Hanbali

When a user selects a madhhab, we can pre-check common exclusions for that school as a starting point. The user can always override.

### Job Listing Display

Instead of "●●●●○ Clearly Halal," each job card shows:
- Employer name + industry
- Concern badges (red/amber tags if concerns exist)
- Positive badges (green tags if islamic_org, halal_certified, etc.)
- "No known concerns" badge for clean employers

### Job Detail Page

Instead of a "halal score card," show an **Employer Classification Card**:
- Company name, industry, size
- Revenue breakdown (if public)
- Concerns listed with explanations
- Positives listed
- Source of classification (public filings, self-reported, etc.)
- "Disagree? Let us know" feedback link

---

## Scraping Pipeline

### Phase 1: JobSpy (Python, open source)

[github.com/speedyapply/JobSpy](https://github.com/speedyapply/JobSpy) — scrapes LinkedIn, Indeed, Glassdoor, ZipRecruiter.

```python
from jobspy import scrape_jobs

jobs = scrape_jobs(
    site_name=["indeed", "linkedin", "glassdoor"],
    search_term="software engineer",
    location="Remote",
    results_wanted=100,
    hours_old=72
)
```

This gets us real, current job listings with structured data.

### Phase 2: Employer Classification

For each new employer encountered in scraped jobs:

1. Check if employer already classified in our database
2. If not, run through Claude Haiku with classification prompt:

```
Given this company name and the job listing context, classify the employer:
- Company: {name}
- Industry: {inferred from listing}
- Job context: {description snippet}

Return a JSON classification with:
- industry, sub_industry
- estimated revenue sources (if well-known company)
- concerns (from our taxonomy)
- positives (from our taxonomy)
- company_type: islamic_org | halal_certified | muslim_founded | conventional | unknown
- confidence: high | medium | low

Be factual. Do not make halal/haram judgments. Only classify based on publicly known information about the company's business model and revenue sources.
```

3. Cache the classification — rate each employer ONCE, apply to all their jobs
4. Flag low-confidence classifications for human review

### Phase 3: Scale (hiring.cafe model)

- Scrape company career pages directly (30,000+)
- Daily refresh cycles
- Ghost job detection via embedding similarity
- Community-contributed employer corrections

---

## MVP Scope (what to build now)

### v1.0 — Static, classifiable

- ~50 classified employers (mix of Islamic orgs, halal-certified, tech, finance, healthcare, etc.)
- ~200 jobs across those employers
- Concern-based filter UI (client-side, no accounts)
- Employer classification card on each job
- "We show facts, you decide" positioning
- Scraping pipeline script (user runs locally, outputs to JSON)

### v1.1 — Supabase + live data

- Move from JSON to Supabase
- Scheduled scraping (daily cron)
- Auto-classification of new employers via Haiku
- Employer submission form

### v2.0 — User accounts

- Saved preferences / madhhab presets
- Job alerts ("email me when a technology job with no concerns is posted")
- Community corrections on employer classifications
- Scholar advisory panel for edge cases

---

## What We're NOT Doing

- **Not issuing fatwas.** We classify. Users decide.
- **Not hiding "haram" jobs.** The whole market is visible. Filtering is the product.
- **Not competing on volume with Indeed.** We compete on the classification layer.
- **Not charging job seekers.** Ever. Revenue comes from employer listings (v2+) and donations.
- **Not claiming authority.** "Based on public information. Not religious advice."

---

## Key Copy Changes

| Old | New |
|---|---|
| "Every job rated for halal compliance" | "See the job market through your values" |
| "Halal Score: ●●●●○" | "No known concerns" or concern tags |
| "Not a fatwa. Just honest guidance." | "We show the facts. You decide." |
| "Fully Certified / Clearly Halal / etc." | "Islamic org / No concerns / Has concerns" |
| "Madhhab notes" (per job) | "Madhhab filter preset" (user preference) |

---

*This architecture is honest, scalable, and doesn't require credentials we don't have. The product is the lens, not the judgment.*
