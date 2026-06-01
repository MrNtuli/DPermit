# Power BI Dashboard — Step-by-Step Build Guide (30 minutes)

Complete this for the **Week 6 live demo** (IS3 mandatory).

---

## Prerequisites

- Power BI Desktop installed (free)
- Supabase project with `setup-all.sql` already run
- Database password from Supabase project creation

---

## Step 1: Connect to PostgreSQL

1. Open **Power BI Desktop**
2. **Get data** → **PostgreSQL database**
3. Server: `db.uafgtzemigqphejuscsu.supabase.co`
4. Database: `postgres`
5. Data connectivity mode: **Import** (recommended for demo)
6. Username: `postgres`
7. Password: your Supabase database password
8. Select these tables/views:
   - `vw_permit_status_summary`
   - `vw_expiring_permits`
   - `vw_verification_summary`
   - `vw_alert_summary`
   - `vw_employer_compliance`
   - `vw_university_compliance`
   - `vw_iot_scan_summary`

> Alternative: copy M queries from `DigiPermit-Queries.pq`

---

## Step 2: Page 1 — Permit Compliance Overview

1. Add **Donut chart**
   - Legend: `status` (from vw_permit_status_summary)
   - Values: `permit_count`
   - Title: `Permit Status Distribution`

2. Add **Table**
   - Source: vw_expiring_permits
   - Columns: foreign_national_name, permit_number, permit_type, days_until_expiry, organisation_name
   - Title: `Permits Expiring Within 90 Days`
   - Sort by days_until_expiry ascending

---

## Step 3: Page 2 — Verification Activity

1. Add **Stacked column chart**
   - Axis: verification_date
   - Legend: scan_type
   - Values: attempt_count
   - Source: vw_verification_summary

2. Add **Clustered bar chart**
   - Axis: verification_result
   - Values: attempt_count

---

## Step 4: Page 3 — Organisation Compliance

1. Add **Clustered bar chart** (employer)
   - Source: vw_employer_compliance
   - Axis: organisation_name
   - Values: active_permits, expiring_soon, expired_permits

2. Add **Card visuals**
   - Total students (university view)
   - Expired study visas

---

## Step 5: Page 4 — Alerts & IoT

1. Add **Matrix** from vw_alert_summary
   - Rows: alert_type
   - Columns: priority
   - Values: alert_count

2. Add **Line chart** from vw_iot_scan_summary
   - Axis: scan_date
   - Values: scan_count
   - Legend: scan_type

---

## Step 6: Save and rehearse

1. Save as `DigiPermit-Analytics.pbix` in `docs/power-bi/`
2. **Refresh** data before demo (Home → Refresh)
3. During presentation: show Page 1 → Page 2 → mention live Supabase connection

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Cannot connect | Use Session pooler host from Supabase Database settings |
| Views empty | Re-run seeds; verify permits exist in Table Editor |
| SSL error | Enable SSL in connection options |

---

## Demo talking points

- "Power BI reads directly from our 3NF PostgreSQL views — same data as the live app."
- "Executives see expiry forecast without manual spreadsheet work."
- "Verification trends show QR vs RFID vs manual adoption."
