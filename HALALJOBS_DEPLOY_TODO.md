# HalalJobs.ai — Deployment Todo List

*Generated March 2026 · Do these in order*

---

## Phase 1: Local Test (do first, takes ~5 min)

- [ ] Open terminal, `cd` to wherever you want to keep the project on your Mac
- [ ] Copy the built project from Claude's session to your local machine:
  ```
  cp -r /sessions/kind-focused-darwin/halaljobs ~/halaljobs
  ```
  *(or find it in your Codefest workspace folder)*
- [ ] `cd halaljobs && npm install`
- [ ] `npm run dev` → open http://localhost:3000
- [ ] Check these pages load:
  - `/` — landing page
  - `/jobs` — job listings with sidebar filters
  - `/jobs/software-engineer-islamic-relief` — job detail page
  - `/about` — about + rating methodology
  - `/about#ratings` — scroll to ratings section
  - `/about#scholars` — scroll to scholars section
  - `/donate` — donate page

---

## Phase 2: GitHub (5 min)

- [ ] Create new repo on GitHub: `halaljobs` (private for now)
- [ ] `git init && git add . && git commit -m "initial build"`
- [ ] `git remote add origin <your-repo-url>`
- [ ] `git push -u origin main`

---

## Phase 3: Vercel Deploy (10 min)

- [ ] Go to vercel.com → Add New Project → Import from GitHub → select `halaljobs`
- [ ] Framework: Next.js (auto-detected)
- [ ] No env variables needed for v1 (JSON-based, no DB yet)
- [ ] Click Deploy
- [ ] You'll get a `halaljobs.vercel.app` URL — test it

---

## Phase 4: Domain (15 min)

- [ ] Buy `halaljobs.ai` at Cloudflare Registrar (cheapest, ~$20/yr for .ai)
  - Or Namecheap if you prefer
  - ⚠️ Do NOT use GoDaddy — overpriced and pushy upsells
- [ ] In Vercel: Settings → Domains → Add `halaljobs.ai` + `www.halaljobs.ai`
- [ ] Follow Vercel's DNS instructions (add CNAME/A records in Cloudflare)
- [ ] SSL auto-provisioned by Vercel — usually live within minutes

---

## Phase 5: Email (10 min)

- [ ] In Cloudflare (where your domain DNS is): Email → Email Routing
- [ ] Add route: `hello@halaljobs.ai` → your Gmail
- [ ] Test: send yourself a test email to `hello@halaljobs.ai`
- [ ] Update the `apply_url` for any job where you want applicants emailing you directly

---

## Phase 6: Donate Button (later)

- [ ] Set up Ko-fi: ko-fi.com (same account as Codefest, or separate)
  - Suggested: separate page `ko-fi.com/halaljobs`
- [ ] Update `/donate/page.tsx` to point to real Ko-fi link
- [ ] Or set up Stripe direct if you want more control

---

## Phase 7: Supabase (when you're ready to scale)

*Skip this for v1 — the site works perfectly from JSON seed data*

When you want to:
- Let employers submit jobs via a form
- Add user accounts / saved jobs
- Scale to 100s of listings

Do this:
- [ ] Create Supabase project at supabase.com
- [ ] Create `jobs` table matching the JSON schema
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel env vars
- [ ] Swap `import jobsData from "@/data/jobs.json"` for Supabase client queries

---

## Ongoing Maintenance

- [ ] Add new jobs: edit `src/data/jobs.json`, push to GitHub (Vercel auto-deploys)
- [ ] Update email in Footer/Header if you change from `hello@halaljobs.ai`
- [ ] Submit to Google Search Console once domain is live
- [ ] Post to r/islam, r/MuslimLounge, Muslim Discord servers once you have 30+ jobs showing

---

## What's Already Built

| Page | Status |
|------|--------|
| Landing page `/` | ✅ Done |
| Jobs listing `/jobs` | ✅ Done — search + category/type/score filters |
| Job detail `/jobs/[slug]` | ✅ Done — full halal reasoning + madhhab notes |
| About `/about` | ✅ Done — methodology, scholar panel, mission |
| Donate `/donate` | ✅ Done (stub — update with real Ko-fi link) |
| 404 page | ✅ Done |
| Header + Footer | ✅ Done |
| 30 seed jobs | ✅ Done — halal-rated with reasoning |

---

*The build is clean: 0 TypeScript errors, all pages linked, fully responsive.*
