# Power BI — Live Supabase connection (recommended)

Connect **Power BI Desktop** directly to your DigiPermit PostgreSQL database on Supabase. Data refreshes from the same analytics views the web app uses.

**Project:** `uafgtzemigqphejuscsu`  
**After connecting:** build visuals in [POWER-BI-DASHBOARD-BUILD-GUIDE.md](./POWER-BI-DASHBOARD-BUILD-GUIDE.md)

---

## Before you start

1. **Analytics views** must exist in Supabase. In **SQL Editor**, run:
   - `digipermit-backend/database/views/analytics_views.sql`  
   - (or full `database/setup-all.sql` if setting up fresh)

2. **Database password** — Supabase Dashboard → **Project Settings** → **Database** → **Database password** (reset if you do not have it).

3. **Power BI Desktop** installed (free).

---

## Step 1 — Get connection details from Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your DigiPermit project.
2. Go to **Project Settings** → **Database**.
3. Under **Connection string**, choose **URI** tab.
4. Enable **Use connection pooling** and set mode to **Session** (best for Power BI on Windows / IPv4).
5. Copy:
   - **Host** (e.g. `aws-0-eu-central-1.pooler.supabase.com`) — use this as **Server** in Power BI, **not** the direct `db.*` host unless pooler fails.
   - **User** — often `postgres.uafgtzemigqphejuscsu` (format `postgres.<project-ref>`)
   - **Database:** `postgres`
   - **Port:** `5432` (session pooler) or `6543` (transaction pooler — prefer **5432 session** for Power BI)

**Direct connection (fallback only):**

| Field | Value |
|-------|--------|
| Server | `db.uafgtzemigqphejuscsu.supabase.co` |
| Database | `postgres` |
| User | `postgres` |
| Port | `5432` |

> Direct host may require IPv6. If you get “host not found”, use the **session pooler** host from step 1.

---

## Step 2 — SSL certificate (if Power BI shows certificate errors)

Supabase requires SSL. If you see *certificate not trusted* or *remote certificate invalid*:

1. In **Database** settings, open **SSL Configuration**.
2. Download the **SSL certificate** (`.crt`).
3. On Windows: `Win + R` → `certlm.msc` → **Trusted Root Certification Authorities** → **Certificates** → right-click → **Import** → select the `.crt` file.
4. Restart **Power BI Desktop**.

**Alternative (less secure, demo only):**  
**File** → **Options and settings** → **Data source settings** → select the PostgreSQL source → **Edit** → disable strict SSL / encryption if your build offers it. Prefer importing the certificate for the presentation.

---

## Step 3 — Connect in Power BI Desktop

1. **Home** → **Get data** → **More…** → **Database** → **PostgreSQL database** → **Connect**.
2. Fill in:

   | Field | Value |
   |-------|--------|
   | Server | Session pooler host from Step 1 |
   | Database | `postgres` |

3. **Data Connectivity mode:** **Import** (recommended for demo stability).
4. **Advanced options** (optional): leave blank unless you need a custom SQL preview.
5. Click **OK** → **Database** authentication:
   - **User name:** `postgres.uafgtzemigqphejuscsu` (pooler) or `postgres` (direct)
   - **Password:** your database password
6. If prompted for **encryption/SSL**, choose **Require** or **Encrypt** (with certificate imported).

---

## Step 4 — Select the seven analytics views

In the **Navigator**, expand **public** and tick **only**:

| View | Used for |
|------|----------|
| `vw_permit_status_summary` | Status donut / KPIs |
| `vw_expiring_permits` | Expiry table |
| `vw_verification_summary` | QR / manual / RFID trends |
| `vw_alert_summary` | Alert matrix |
| `vw_employer_compliance` | Employer bars |
| `vw_university_compliance` | University bars |
| `vw_iot_scan_summary` | IoT line chart |

Click **Load** (or **Transform Data** if you want to rename queries first).

Do **not** load entire raw tables (`permits`, `users`, …) unless you need them for extra credit — the views are enough for the capstone dashboard.

---

## Step 5 — Optional: Power Query (M) instead of Navigator

If views do not appear:

1. **Home** → **Transform data** → **New Source** → **Blank Query** → **Advanced Editor**.
2. Paste one block from `DigiPermit-Queries.pq` (update the server string to your **pooler host**).
3. Repeat for each view, or use a single PostgreSQL source and reference it.

Example (replace host and use your credentials when prompted):

```powerquery
let
    Source = PostgreSQL.Database("aws-0-REGION.pooler.supabase.com", "postgres"),
    Data = Source{[Schema="public", Item="vw_permit_status_summary"]}[Data]
in
    Data
```

---

## Step 6 — Theme, pages, save

1. **View** → **Themes** → **Browse** → `DigiPermit-Theme.json`
2. Build four report pages — [POWER-BI-DASHBOARD-BUILD-GUIDE.md](./POWER-BI-DASHBOARD-BUILD-GUIDE.md) Part C
3. Optional KPIs — measures in `DigiPermit-Measures.dax`
4. **File** → **Save as** → `docs/power-bi/DigiPermit-Analytics.pbix`

---

## Step 7 — Refresh before demo

1. Use the app / demo script to create verifications or RFID scans if you want fresh IoT data.
2. In Power BI: **Home** → **Refresh** (pulls latest from Supabase).
3. Confirm row counts (e.g. verifications increased after QR demo).

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Host not found | Use **Session pooler** host, not `db.*` direct |
| Login failed | User must be `postgres.<project-ref>` for pooler; password = **database** password, not API anon key |
| Certificate / SSL error | Import Supabase `.crt` into Trusted Root; restart Power BI |
| Views missing in Navigator | Run `analytics_views.sql` in SQL Editor; refresh navigator |
| Views load but empty | Run backend seeds; check **Table Editor** for `permits` rows |
| `vw_iot_scan_summary` empty | Run **Verification → RFID Simulation** once, then Refresh |
| Connection slow | Stay on **Import** mode; avoid DirectQuery for demo |
| IPv6 errors | Session pooler on port 5432 (IPv4-friendly) |

**CSV fallback** (offline only): [POWER-BI-CSV-IMPORT.md](./POWER-BI-CSV-IMPORT.md)

---

## What to say in the demo

> “This dashboard uses a **live PostgreSQL connection** to Supabase — the same database as our DigiPermit API. These are SQL **views** on our 3NF schema, so executives see permit status, expiries, and verification trends without exporting spreadsheets.”

---

## Connection checklist

- [ ] Session pooler host copied from Supabase
- [ ] Database password (not service role API key)
- [ ] Seven `vw_*` views loaded
- [ ] Theme applied
- [ ] Four pages built
- [ ] Refresh tested after a demo login / verification
