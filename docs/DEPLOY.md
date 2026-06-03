# Deploy DigiPermit — Live URL for [MrNtuli/DPermit](https://github.com/MrNtuli/DPermit)

You will get **two links**:

| Service | Example URL | What it is |
|---------|-------------|------------|
| **App (frontend)** | `https://mrntuli.github.io/DPermit/` | What lecturers open in the browser |
| **API (backend)** | `https://digipermit-api.onrender.com` | Runs Express; frontend talks to this |

Database stays on **Supabase** (already in the cloud).

---

## Visibility: Public or Private?

**Recommendation: Public** for a capstone project.

| | Public | Private |
|---|--------|---------|
| Lecturers open link | No GitHub access needed | May need collaborator invite |
| GitHub Pages | Works on free plan | Works on free plan |
| Portfolio | Visible on your profile | Hidden unless shared |
| Secrets | Still **not** in code — use Render env vars | Same |

Use **Private** only if your institution requires it. The live app link still works either way.

---

## Part 1 — Push code to GitHub

1. Create repo: [github.com/new](https://github.com/new) → name **`DPermit`** → **Public** (recommended) → no README.
2. In PowerShell:

```powershell
cd c:\Users\Lenovo\Desktop\DPermit
git init
git add .
git commit -m "feat: DigiPermit capstone — full-stack compliance system"
git branch -M main
git remote add origin https://github.com/MrNtuli/DPermit.git
git push -u origin main
```

Never commit `digipermit-backend/.env`.

---

## Part 2 — Deploy API on Render (free)

1. Sign in at [render.com](https://render.com) with **GitHub**.
2. **New +** → **Web Service** → connect **MrNtuli/DPermit**.
3. Settings:

| Field | Value |
|-------|--------|
| Name | `digipermit-api` |
| Root Directory | `digipermit-backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance type | Free |

4. **Environment** (from your local `.env` — paste in Render dashboard only):

| Key | Value |
|-----|--------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | From Supabase API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase (secret) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://mrntuli.github.io,https://mrntuli.github.io/DPermit` |

5. Deploy → copy URL, e.g. `https://digipermit-api.onrender.com`.
6. Test: open `https://digipermit-api.onrender.com/api/health` → should return JSON success.
7. **One-time:** Render **Shell** or local with production env → `npm run seed` (creates demo users).

**Note:** Free Render sleeps after ~15 min idle; first request may take 30–60 seconds to wake.

---

## Part 3 — GitHub Pages (frontend)

### A. Set API URL for builds

1. GitHub repo **MrNtuli/DPermit** → **Settings** → **Secrets and variables** → **Actions** → **Variables**.
2. New repository variable:

| Name | Value |
|------|--------|
| `DIGIPERMIT_API_URL` | `https://digipermit-api.onrender.com/api` |

(Use your real Render URL + `/api`.)

### B. Enable Pages

1. **Settings** → **Pages**.
2. **Source:** **GitHub Actions** (not “Deploy from branch”).

### C. Run deploy

1. **Actions** tab → workflow **Deploy Frontend to GitHub Pages** → **Run workflow**.
2. When green, open: **https://mrntuli.github.io/DPermit/**

Login with `admin@digipermit.demo` / `Demo@12345` (after seed).

---

## Part 4 — Supabase Auth URLs

Supabase → **Authentication** → **URL configuration**:

| Field | Value |
|-------|--------|
| Site URL | `https://mrntuli.github.io/DPermit/` |
| Redirect URLs | `https://mrntuli.github.io/DPermit/**` |

---

## Part 5 — What works on the live link

| Feature | Live |
|---------|------|
| Login, dashboards, CRUD | Yes (after seed) |
| QR camera scan | Yes on **HTTPS** (GitHub Pages) |
| Power BI | Separate — still uses Supabase |
| First load after idle | Render API may be slow to wake |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login fails / network error | Check `DIGIPERMIT_API_URL` variable; check Render health URL |
| CORS error | Add GitHub Pages URL to Render `FRONTEND_URL` |
| 404 on refresh | `base-href` is `/DPermit/` — use repo name exactly **DPermit** |
| Empty app | Open browser devtools → failed `api` calls → fix API URL |

---

## Links to put in your report

```
Repository: https://github.com/MrNtuli/DPermit
Live app:     https://mrntuli.github.io/DPermit/
API health:   https://digipermit-api.onrender.com/api/health
```

Replace API host if you chose a different Render service name.
