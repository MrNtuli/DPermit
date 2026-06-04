# Power BI Dashboard — Build guide (~30 minutes)

**Connect first:** [POWER-BI-LIVE-SUPABASE.md](./POWER-BI-LIVE-SUPABASE.md) (live Supabase PostgreSQL).  
CSV fallback only: [POWER-BI-CSV-IMPORT.md](./POWER-BI-CSV-IMPORT.md).

---

## Part A — Connect data (live Supabase)

Complete **[POWER-BI-LIVE-SUPABASE.md](./POWER-BI-LIVE-SUPABASE.md)** Steps 1–4, then return here.

Quick reference — load these seven views only:

- `vw_permit_status_summary`
- `vw_expiring_permits`
- `vw_verification_summary`
- `vw_alert_summary`
- `vw_employer_compliance`
- `vw_university_compliance`
- `vw_iot_scan_summary`

Use the **session pooler** host and user `postgres.uafgtzemigqphejuscsu` from Supabase Database settings (not the API keys in `.env`).

---

## Part B — Theme and summary row

1. **View → Themes → Browse** → `DigiPermit-Theme.json`
2. Add a report page **Executive Summary** (optional, good for demo open):
   - **Card:** `Total Permits` measure (see `DigiPermit-Measures.dax`)
   - **Card:** `Active Permits`
   - **Card:** `Expiring Soon Permits`
   - **Card:** `Unresolved Alerts`
   - **Donut:** `vw_permit_status_summary` — Legend `status`, Values `permit_count`

---

## Part C — Four dashboard pages

### Page 1 — Permit compliance overview

| Visual | Fields |
|--------|--------|
| **Donut chart** | Legend: `status`, Values: `permit_count` — source `vw_permit_status_summary` |
| **Table** | `foreign_national_name`, `permit_number`, `permit_type`, `days_until_expiry`, `organisation_name` — source `vw_expiring_permits`, sort `days_until_expiry` ascending |

Title: *Permit Status Distribution* / *Expiring Within 90 Days*

### Page 2 — Verification activity

| Visual | Fields |
|--------|--------|
| **Stacked column** | Axis: `verification_date`, Legend: `scan_type`, Values: `attempt_count` |
| **Clustered bar** | Axis: `verification_result`, Values: `attempt_count` |

Source: `vw_verification_summary`

### Page 3 — Organisation compliance

| Visual | Fields |
|--------|--------|
| **Clustered bar** | Axis: `organisation_name`, Values: `active_permits`, `expiring_soon`, `expired_permits` — `vw_employer_compliance` |
| **Clustered bar** | Axis: `organisation_name`, Values: `active_study_visas`, `expiring_soon`, `expired_study_visas` — `vw_university_compliance` |
| **Cards** | `total_students`, `expired_study_visas` (university table) |

### Page 4 — Alerts & IoT

| Visual | Fields |
|--------|--------|
| **Matrix** | Rows: `alert_type`, Columns: `priority`, Values: `alert_count` — `vw_alert_summary` |
| **Line chart** | Axis: `scan_date`, Values: `scan_count`, Legend: `scan_type` — `vw_iot_scan_summary` |

---

## Part D — Finish

1. Save as **`DigiPermit-Analytics.pbix`** in `docs/power-bi/`
2. **Home → Refresh** before the live demo
3. Presentation flow: Executive Summary (or Page 1) → Page 2 → Page 3 → mention same DB as web app

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Cannot connect to PostgreSQL | Use Session pooler host; or use CSV path |
| Views empty | Run seeds + `analytics_views.sql`; export script should show row counts |
| SSL error | Enable SSL; try port 5432 on pooler connection string |
| `status` not recognized in DAX | Table name must be `vw_permit_status_summary` exactly |

---

## Demo talking points

- “Analytics views sit on our normalised PostgreSQL schema — same data the Node API serves.”
- “Employers and universities get compliance bars without exporting spreadsheets.”
- “Verification page shows QR vs manual vs RFID volume from `verification_logs`.”
