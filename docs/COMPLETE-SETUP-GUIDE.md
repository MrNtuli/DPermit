# DigiPermit — Complete setup guide (MrNtuli)

One place for **code**, **live hosting**, **demo**, and **submission**.

---

## Status tracker (tick as you go)

| # | Task | Status |
|---|------|--------|
| 1 | Code on GitHub | ✅ [github.com/MrNtuli/DPermit](https://github.com/MrNtuli/DPermit) |
| 2 | Supabase DB + local `.env` works | ⬜ |
| 3 | Render API deployed + `/api/health` OK | ⬜ |
| 4 | `npm run seed` on production API | ⬜ |
| 5 | GitHub variable `DIGIPERMIT_API_URL` set | ⬜ |
| 6 | GitHub Pages workflow run (green) | ⬜ |
| 7 | Live app opens + login works | ⬜ |
| 8 | Supabase Auth URLs updated | ⬜ |
| 9 | Full demo rehearsed once | ⬜ |
| 10 | Power BI + Packet Tracer + report | ⬜ |

---

## A. Already done

- Repository: **https://github.com/MrNtuli/DPermit**
- Branch `main` pushed with full project + deploy workflow

---

## B. Local run (always keep this as backup)

**Terminal 1**
```powershell
cd c:\Users\Lenovo\Desktop\DPermit\digipermit-backend
npm run dev
```

**Terminal 2**
```powershell
cd c:\Users\Lenovo\Desktop\DPermit\digipermit-frontend
npm start
```

Open **http://localhost:4200** — login `admin@digipermit.demo` / `Demo@12345`

**Verify:** `powershell -File c:\Users\Lenovo\Desktop\DPermit\scripts\verify-system.ps1` (backend must be running)

---

## C. Live hosting (lecturer link)

Detailed steps: **[DEPLOY.md](./DEPLOY.md)**

### C1. Render (API) — ~15 min

1. [render.com](https://render.com) → Sign in with **GitHub**
2. **New +** → **Web Service** → repo **MrNtuli/DPermit**
3. **Root Directory:** `digipermit-backend`
4. **Build:** `npm install` | **Start:** `npm start` | **Free** plan
5. **Environment variables** (copy from local `digipermit-backend/.env` — never commit this file):

   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://mrntuli.github.io,https://mrntuli.github.io/DPermit`

6. Deploy → note URL: `https://digipermit-api.onrender.com` (name may vary)
7. Browser test: `https://YOUR-URL.onrender.com/api/health` → `"success": true`
8. Seed demo users (pick one):
   - **Render Shell:** `cd digipermit-backend && npm run seed`
   - Or temporarily point local `.env` PORT to test — easier: use Render dashboard **Shell**

### C2. GitHub Pages (app) — ~10 min

1. [github.com/MrNtuli/DPermit/settings/variables/actions](https://github.com/MrNtuli/DPermit/settings/variables/actions)
2. **New variable:** `DIGIPERMIT_API_URL` = `https://YOUR-RENDER-URL.onrender.com/api`
3. [Settings → Pages](https://github.com/MrNtuli/DPermit/settings/pages) → **Source:** **GitHub Actions**
4. [Actions](https://github.com/MrNtuli/DPermit/actions) → **Deploy Frontend to GitHub Pages** → **Run workflow**
5. When green → open **https://mrntuli.github.io/DPermit/**

### C3. Supabase Auth

Supabase dashboard → **Authentication** → **URL configuration**:

- **Site URL:** `https://mrntuli.github.io/DPermit/`
- **Redirect URLs:** add `https://mrntuli.github.io/DPermit/**`

---

## D. 15-minute demo (presentation)

| Step | Login | What to show |
|------|--------|----------------|
| 1 | `admin@digipermit.demo` | Dashboard + analytics **filters** |
| 2 | `hr@acmeglobal.demo` | Register/capture permit OR Sompisi flow |
| 3 | `james.okonkwo@demo.mail` OR permit doc from HR | **QR on permit document** |
| 4 | `verify@digipermit.demo` | **QR Scan** or manual `WP-2024-ACME-001` |
| 5 | `admin@digipermit.demo` | Alerts / verification logs |

Password: `Demo@12345`

New person test (no James): see conversation guide — HR → capture permit → document icon → scan.

---

## E. Academic deliverables (IS3 / IP2 / DS3)

| Module | File / task |
|--------|-------------|
| IS3 BPMN | [IS3-BPMN-PROCESS-MODELS.md](./IS3-BPMN-PROCESS-MODELS.md) |
| IS3 ERD | [IS3-ERD.md](./IS3-ERD.md) |
| IS3 IoT | [PACKET-TRACER-LAB-GUIDE.md](./PACKET-TRACER-LAB-GUIDE.md) + screenshot |
| IS3 Power BI | [power-bi/POWER-BI-DASHBOARD-BUILD-GUIDE.md](./power-bi/POWER-BI-DASHBOARD-BUILD-GUIDE.md) |
| IP2 API | [API-SPECIFICATION.md](./API-SPECIFICATION.md) + Postman collection |
| IP2 Test | [TEST-PLAN.md](./TEST-PLAN.md) + [ROLE-USER-STORIES-TEST-GUIDE.pdf](./ROLE-USER-STORIES-TEST-GUIDE.pdf) |
| DS3 Sprints | [sprints/](./sprints/) |
| Final report | [FINAL-PROJECT-REPORT.md](./FINAL-PROJECT-REPORT.md) |
| Slides | [PRESENTATION-SLIDE-DECK.md](./PRESENTATION-SLIDE-DECK.md) |
| Demo script | [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) |

**Put in report:**
```
Repository: https://github.com/MrNtuli/DPermit
Live app:     https://mrntuli.github.io/DPermit/   (after deploy)
```

---

## F. If something breaks

| Symptom | Fix |
|---------|-----|
| Live login fails | Check `DIGIPERMIT_API_URL`; wake Render (wait 60s); re-run seed |
| CORS error | `FRONTEND_URL` on Render must include `https://mrntuli.github.io/DPermit` |
| Pages 404 | Repo name must be **DPermit** (case-sensitive path) |
| Camera QR on live | Use HTTPS Pages URL, not localhost |
| Class demo no internet | Use localhost (section B) |

---

## G. What only you can do (no passwords in chat)

- Render + Supabase dashboard login
- Paste secrets into Render env vars
- Power BI desktop build
- Packet Tracer screenshot
- Presentation rehearsal with team

When stuck, note **step number** and **error message** (not passwords).
