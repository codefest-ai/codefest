# Codefest.ai — Launch Checklist

Weekend launch guide. Do these in order.

---

## 1. Supabase Setup

### 1a. Create your project
1. Go to [supabase.com](https://supabase.com) → New project
2. Name: `codefest-prod`, region: `us-east-1` (or closest to you)
3. Save your database password somewhere safe

### 1b. Run migrations (in order)
Go to **SQL Editor** in your Supabase dashboard and run each file:

```
migrations/001_phase1_profiles_bookmarks.sql   ← Run first (always)
migrations/002_phase2_teams.sql                ← Run for Teams feature
migrations/003_phase3_projects_tasks.sql       ← Run for Project Boards
migrations/004_phase4_competitions.sql         ← Run for Competitions
```

For your weekend launch, run **001 only**. Run 002–004 in week 2 when you enable those features.

### 1c. Enable Google OAuth
1. Supabase dashboard → Authentication → Providers → Google → Enable
2. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Authorized redirect URIs: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Copy Client ID and Secret back into Supabase Google provider settings

### 1d. Get your env vars
Supabase dashboard → Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL` — your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the `anon` key (public)

---

## 2. Local .env Setup

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Test locally:
```bash
npm install
npm run dev
```

Visit http://localhost:3000 — try signing in with Google.

---

## 3. Vercel Deployment

### 3a. Push to GitHub
```bash
git add .
git commit -m "launch: codefest.ai v1"
git push origin main
```

### 3b. Import to Vercel
1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import your GitHub repo
3. Framework: Next.js (auto-detected)
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy

### 3c. Connect your domain
1. Vercel project → Settings → Domains → Add `codefest.ai`
2. Add CNAME record at your DNS registrar:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
3. For apex domain (`codefest.ai`): add an A record pointing to `76.76.21.21`
4. Wait 5–30 min for DNS to propagate

### 3d. Update OAuth redirect URI
Once your domain is live, go back to Google Cloud Console and add:
```
https://codefest.ai/auth/callback
https://www.codefest.ai/auth/callback
```

Also add these to Supabase: Authentication → URL Configuration:
- Site URL: `https://codefest.ai`
- Redirect URLs: `https://codefest.ai/**`

---

## 4. OG Image

The metadata references `/og.png` (1200×630px). You need to create this before launch.

Quick option: use [og-image.vercel.app](https://og-image.vercel.app) or Figma.
Content: "Codefest.ai — Stop wasting the first hour."
Drop the file at: `public/og.png`

---

## 5. Pre-Launch Checklist

- [ ] `npm run build` passes with zero errors locally
- [ ] Sign in with Google works (dev)
- [ ] Bookmark a component, refresh — bookmark persists
- [ ] `/library` filters work
- [ ] `/workspace` loads; session saves on refresh
- [ ] 404 page shows at `/nowhere`
- [ ] Error page works (optional: temporarily throw in a page to test)
- [ ] Vercel deploy completes without errors
- [ ] `https://codefest.ai` loads (not just the Vercel URL)
- [ ] Google sign-in works on production domain
- [ ] OG image shows when you paste the URL in Slack/Twitter
- [ ] `robots.txt` accessible at `https://codefest.ai/robots.txt`

---

## 6. Phased Rollout Plan

### Weekend launch (now)
- Landing page
- Component Library (browse, filter, bookmark)
- Workspace (session planning)
- Google OAuth + .edu detection

Nav items for launch:
- Library ✅
- Workspace ✅
- Teams → **hide from nav or mark "coming soon"** until week 2
- Compete → **hide from nav** until week 2

### Week 2 (after launch)
- Run migrations 002 + 003 in Supabase
- Enable Teams + Project Boards in nav
- Announce to early users

### Week 3
- Run migration 004
- Enable Competitions
- AI GO! Mode
- GitHub integration

---

## 7. Quick Fixes

**Build fails with "module not found":**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Supabase 401 errors:**
- Check env vars are set in Vercel (Settings → Environment Variables)
- Redeploy after adding vars

**Google sign-in redirect error:**
- Verify redirect URI matches exactly in both Google Console and Supabase
- Check for trailing slashes

**"Cannot read properties of null" on hydration:**
- Always check for `user` before rendering user-dependent UI
- Use `if (!user) return <SignInPrompt />`

---

## Contacts / Accounts

- Supabase: [app.supabase.com](https://app.supabase.com)
- Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
- Google Cloud: [console.cloud.google.com](https://console.cloud.google.com)
- Domain registrar: wherever codefest.ai is registered

---

*Generated: February 2026 — Codefest.ai v1 launch*
