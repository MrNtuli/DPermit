# Power BI — Import from CSV (no PostgreSQL connector)

Use this when the Supabase PostgreSQL connector fails or you need a fast demo build.

## Step 1: Export data from Supabase

```powershell
cd c:\Users\Lenovo\Desktop\DPermit\digipermit-backend
node scripts/export-powerbi-data.js
```

You should see 7 `[OK]` lines and files in `docs/power-bi/data/`:

- `vw_permit_status_summary.csv`
- `vw_expiring_permits.csv`
- `vw_verification_summary.csv`
- `vw_alert_summary.csv`
- `vw_employer_compliance.csv`
- `vw_university_compliance.csv`
- `vw_iot_scan_summary.csv`

If a view fails, run `database/views/analytics_views.sql` in Supabase SQL Editor, then export again.

## Step 2: Import into Power BI

1. Open **Power BI Desktop**
2. **Get data** → **Text/CSV**
3. Select all 7 files in `docs/power-bi/data/` (or import one by one)
4. For each file: **Load** (not Transform, unless dates need fixing)
5. Rename queries if needed to match table names above (no spaces)

## Step 3: Build the same 4 pages

Use the visual instructions in [POWER-BI-DASHBOARD-BUILD-GUIDE.md](./POWER-BI-DASHBOARD-BUILD-GUIDE.md) — field names are identical.

## Step 4: Refresh before demo

Re-run the export script, then in Power BI:

**Home → Transform data** → each query → **Refresh**  
Or **Home → Refresh** if you used “Folder” connector:

**Get data** → **Folder** → point to `docs/power-bi/data` → combine CSVs (optional advanced setup).

Simplest refresh: re-import CSVs or use **Data source settings → Refresh**.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Missing SUPABASE_URL` | Copy `digipermit-backend/.env` from Render/Supabase dashboard |
| 0 rows in CSV | Run seeds: `npm run seed` against your project |
| View not found | Run `analytics_views.sql` in SQL Editor |
| Dates show as text | In Power Query, set `verification_date` / `expiry_date` to Date type |
