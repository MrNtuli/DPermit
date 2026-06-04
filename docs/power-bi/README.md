# DigiPermit Power BI — Start here

Build **`DigiPermit-Analytics.pbix`** for the IS3 / Week 6 demo using a **live Supabase PostgreSQL** connection.

---

## Live connection (your setup)

Follow **[POWER-BI-LIVE-SUPABASE.md](./POWER-BI-LIVE-SUPABASE.md)** end to end:

1. Confirm analytics views in Supabase SQL Editor  
2. Copy **session pooler** host + `postgres.uafgtzemigqphejuscsu` user + database password  
3. Power BI → **PostgreSQL database** → load seven `vw_*` views  
4. Apply **`DigiPermit-Theme.json`** and build pages in **[POWER-BI-DASHBOARD-BUILD-GUIDE.md](./POWER-BI-DASHBOARD-BUILD-GUIDE.md)**  
5. **Home → Refresh** before the live presentation  

| Setting | DigiPermit project |
|---------|-------------------|
| Pooler / direct host | From Supabase → Database → Connection string (Session mode) |
| Direct fallback server | `db.uafgtzemigqphejuscsu.supabase.co` |
| Database | `postgres` |
| Views to load | 7 × `vw_*` (listed in live guide) |

---

## Fallback: CSV import

Only if SSL or pooler connection fails on your laptop: **[POWER-BI-CSV-IMPORT.md](./POWER-BI-CSV-IMPORT.md)** and `npm run export:powerbi`.

---

## Files in this folder

| File | Purpose |
|------|---------|
| **POWER-BI-LIVE-SUPABASE.md** | Live Supabase + SSL + pooler (primary) |
| POWER-BI-DASHBOARD-BUILD-GUIDE.md | Charts and pages (30 min) |
| POWER-BI-CSV-IMPORT.md | Offline CSV fallback |
| DigiPermit-Queries.pq | Power Query (M) snippets |
| DigiPermit-Theme.json | Government-tech colours |
| DigiPermit-Measures.dax | KPI card measures |
| data/ | CSV exports (optional backup) |

---

## Demo line

> “Power BI connects **live** to our Supabase PostgreSQL analytics views — the same data as the DigiPermit web app and REST API.”

See also: [../POWER-BI-SETUP.md](../POWER-BI-SETUP.md)
