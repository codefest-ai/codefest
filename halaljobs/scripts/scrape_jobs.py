#!/usr/bin/env python3
"""
HalalJobs Scraping Pipeline Prototype

Uses JobSpy (python-jobspy) to scrape jobs from LinkedIn, Indeed, Glassdoor, ZipRecruiter.
Then classifies employers using our AAOIFI-aligned screening data.

Requirements:
  pip install python-jobspy pandas

Usage:
  python scripts/scrape_jobs.py --search "software engineer" --location "Remote" --results 50
  python scripts/scrape_jobs.py --search "data analyst" --location "New York" --results 100

This is a prototype — production use requires:
  - Rate limiting and respectful scraping
  - Caching to avoid duplicate fetches
  - Employer classification pipeline (currently uses existing data)
  - Job deduplication across sources
"""

import argparse
import json
import sys
from pathlib import Path
from datetime import datetime

try:
    from jobspy import scrape_jobs
    import pandas as pd
except ImportError:
    print("Required packages not installed. Run:")
    print("  pip install python-jobspy pandas")
    sys.exit(1)


# Path to our employer data
EMPLOYERS_PATH = Path(__file__).parent.parent / "src" / "data" / "employers.json"
JOBS_PATH = Path(__file__).parent.parent / "src" / "data" / "jobs.json"


def load_employers():
    """Load existing employer classifications."""
    with open(EMPLOYERS_PATH) as f:
        data = json.load(f)
    return {e["name"].lower(): e for e in data["employers"]}


def load_existing_jobs():
    """Load existing job data."""
    with open(JOBS_PATH) as f:
        return json.load(f)


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    import re
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:80]


def find_employer_match(company_name: str, employers: dict) -> dict | None:
    """Try to match a scraped company name to our employer database."""
    name_lower = company_name.lower().strip()

    # Exact match
    if name_lower in employers:
        return employers[name_lower]

    # Partial match (company name contains or is contained in our data)
    for emp_name, emp_data in employers.items():
        if emp_name in name_lower or name_lower in emp_name:
            return emp_data

    return None


def scrape_and_process(search_term: str, location: str, results_wanted: int, site_names: list[str] | None = None):
    """Scrape jobs and match them to our employer data."""
    if site_names is None:
        site_names = ["indeed", "linkedin", "glassdoor", "zip_recruiter"]

    print(f"\nScraping '{search_term}' in '{location}' ({results_wanted} results)...")
    print(f"Sites: {', '.join(site_names)}")

    jobs = scrape_jobs(
        site_name=site_names,
        search_term=search_term,
        location=location,
        results_wanted=results_wanted,
        hours_old=168,  # last 7 days
        country_indeed="USA",
    )

    print(f"Found {len(jobs)} jobs")

    if jobs.empty:
        print("No jobs found.")
        return []

    employers = load_employers()
    matched = 0
    unmatched_companies = set()
    processed_jobs = []

    for _, row in jobs.iterrows():
        company = str(row.get("company", "Unknown"))
        employer_match = find_employer_match(company, employers)

        job_entry = {
            "title": str(row.get("title", "")),
            "company": company,
            "location": str(row.get("location", "")),
            "salary": str(row.get("min_amount", "")) if pd.notna(row.get("min_amount")) else "",
            "description": str(row.get("description", ""))[:500],
            "url": str(row.get("job_url", "")),
            "date_posted": str(row.get("date_posted", "")),
            "site": str(row.get("site", "")),
            "employer_matched": employer_match is not None,
            "screening_status": employer_match["screening_status"] if employer_match else "NOT_SCREENED",
            "employer_id": employer_match["id"] if employer_match else None,
        }

        processed_jobs.append(job_entry)

        if employer_match:
            matched += 1
        else:
            unmatched_companies.add(company)

    print(f"\nResults:")
    print(f"  Total jobs scraped: {len(processed_jobs)}")
    print(f"  Matched to existing employers: {matched}")
    print(f"  Unmatched (need classification): {len(unmatched_companies)}")

    if unmatched_companies:
        print(f"\n  Unmatched companies ({len(unmatched_companies)}):")
        for c in sorted(unmatched_companies)[:20]:
            print(f"    - {c}")
        if len(unmatched_companies) > 20:
            print(f"    ... and {len(unmatched_companies) - 20} more")

    return processed_jobs


def export_to_json(jobs: list, output_path: str):
    """Export processed jobs to JSON file."""
    with open(output_path, "w") as f:
        json.dump({"scraped_at": datetime.now().isoformat(), "jobs": jobs}, f, indent=2)
    print(f"\nExported {len(jobs)} jobs to {output_path}")


def generate_new_employer_stubs(jobs: list) -> list[dict]:
    """Generate employer stubs for companies not in our database."""
    unmatched = {}
    for job in jobs:
        if not job["employer_matched"]:
            company = job["company"]
            if company not in unmatched:
                unmatched[company] = {
                    "id": slugify(company),
                    "name": company,
                    "industry": "unknown",
                    "sub_industry": "unknown",
                    "revenue_sources": [],
                    "positives": [],
                    "activities": [],
                    "company_type": "conventional",
                    "publicly_traded": False,
                    "employee_count": 0,
                    "hq_country": "US",
                    "careers_url": "",
                    "classification_source": "auto_stub",
                    "last_reviewed": datetime.now().strftime("%Y-%m-%d"),
                    "screening_status": "NOT_SCREENED",
                    "job_count": 0,
                }
            unmatched[company]["job_count"] += 1

    # Sort by job count (most jobs first = highest priority to classify)
    stubs = sorted(unmatched.values(), key=lambda x: x["job_count"], reverse=True)
    for s in stubs:
        del s["job_count"]

    return stubs


def main():
    parser = argparse.ArgumentParser(description="HalalJobs scraping pipeline prototype")
    parser.add_argument("--search", required=True, help="Search term (e.g., 'software engineer')")
    parser.add_argument("--location", default="Remote", help="Location (default: Remote)")
    parser.add_argument("--results", type=int, default=50, help="Number of results (default: 50)")
    parser.add_argument("--sites", nargs="+", default=None, help="Sites to scrape (default: all)")
    parser.add_argument("--output", default=None, help="Output JSON file path")
    parser.add_argument("--stubs", default=None, help="Output employer stubs JSON for unmatched companies")

    args = parser.parse_args()

    jobs = scrape_and_process(
        search_term=args.search,
        location=args.location,
        results_wanted=args.results,
        site_names=args.sites,
    )

    if not jobs:
        return

    # Export jobs
    output_path = args.output or f"scraped_{slugify(args.search)}_{datetime.now().strftime('%Y%m%d')}.json"
    export_to_json(jobs, output_path)

    # Export employer stubs
    if args.stubs:
        stubs = generate_new_employer_stubs(jobs)
        with open(args.stubs, "w") as f:
            json.dump({"employers": stubs}, f, indent=2)
        print(f"Generated {len(stubs)} employer stubs → {args.stubs}")

    # Summary stats
    by_status = {}
    for job in jobs:
        status = job["screening_status"]
        by_status[status] = by_status.get(status, 0) + 1

    print("\nScreening status distribution:")
    for status, count in sorted(by_status.items()):
        print(f"  {status}: {count}")


if __name__ == "__main__":
    main()
