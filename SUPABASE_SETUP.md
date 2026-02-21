# Supabase Setup for Codefest.ai

Total time: ~5 minutes. Four steps.

---

## Step 1: Create the project (~1 min)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Name: `codefest-ai`
4. Database password: generate a strong one (save it somewhere)
5. Region: pick the closest to you
6. Click **Create new project** — wait ~2 minutes for it to provision

---

## Step 2: Copy your keys into .env.local (~30 sec)

1. Go to **Settings → API** (left sidebar)
2. Copy **Project URL** and **anon public key**
3. Open `C:\Users\evren\Codefest\.env.local` and replace the placeholders:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

---

## Step 3: Run the database migration (~30 sec)

1. Go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `C:\Users\evren\Codefest\supabase\migration.sql`, copy the entire file
4. Paste into the SQL editor
5. Click **Run** — you should see "Success. No rows returned"

---

## Step 4: Enable Google OAuth (~2 min)

1. Go to **Authentication → Providers** (left sidebar)
2. Find **Google** and click to expand
3. Toggle it **ON**
4. You need a Google OAuth Client ID + Secret:
   - Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
   - Create a new **OAuth 2.0 Client ID** (Web application)
   - Authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
     (copy this from the Supabase Google provider settings — it shows the exact URL)
   - Copy the **Client ID** and **Client Secret** back into Supabase
5. Click **Save**

---

## Verify it works

```bash
cd C:\Users\evren\Codefest
npm run dev
```

- Visit `localhost:3000` — landing page loads
- Visit `localhost:3000/login` — click "Continue with Google"
- After sign-in, you should see your avatar in the header
- Go to `/library`, bookmark a component, refresh — bookmark persists

---

*That's it. You're live.*
