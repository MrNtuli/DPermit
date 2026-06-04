# Power BI Setup for DigiPermit

## Quick start (live Supabase)

**Primary guide:** [power-bi/POWER-BI-LIVE-SUPABASE.md](./power-bi/POWER-BI-LIVE-SUPABASE.md)

1. Apply views: `digipermit-backend/database/views/analytics_views.sql`
2. Power BI → PostgreSQL → session pooler host → load seven `vw_*` views
3. Build report: [power-bi/POWER-BI-DASHBOARD-BUILD-GUIDE.md](./power-bi/POWER-BI-DASHBOARD-BUILD-GUIDE.md)
4. Theme: import `power-bi/DigiPermit-Theme.json`
5. Before demo: **Home → Refresh**

CSV fallback: `npm run export:powerbi` → [power-bi/POWER-BI-CSV-IMPORT.md](./power-bi/POWER-BI-CSV-IMPORT.md)

## Overview

DigiPermit exposes analytics through **SQL views** in Supabase PostgreSQL and **REST API endpoints**. Power BI can connect directly to the database views for live dashboards, or import CSV exports from the same views.

## Prerequisites

- Power BI Desktop
- Supabase project with migrations and views applied
- Database connection string from Supabase (Settings → Database → Connection string)

## Step 1: Apply SQL Views

Run in Supabase SQL Editor:

```
database/views/analytics_views.sql
```

Available views:

| View | Purpose |
|------|---------|
| `vw_permit_status_summary` | Permit status distribution |
| `vw_expiring_permits` | Permits expiring within 90 days |
| `vw_verification_summary` | Verification attempts by date/type/result |
| `vw_alert_summary` | Alerts by type, priority, status |
| `vw_employer_compliance` | Work-visa compliance by employer |
| `vw_university_compliance` | Study-visa compliance by university |
| `vw_iot_scan_summary` | IoT scan events summary |

## Step 2: Connect Power BI to PostgreSQL

1. Open Power BI Desktop → **Get Data** → **PostgreSQL database**
2. Enter Supabase host: `db.<project-ref>.supabase.co`
3. Database: `postgres`
4. Select **DirectQuery** or **Import** mode
5. Choose the views listed above

## Step 3: Recommended Dashboard Pages

### Page 1: Permit Compliance Overview
- Donut chart: `vw_permit_status_summary`
- Table: `vw_expiring_permits` filtered by days_until_expiry

### Page 2: Verification Activity
- Stacked bar: `vw_verification_summary` by scan_type
- Line chart: verification attempts over time

### Page 3: Organisation Compliance
- Bar chart: `vw_employer_compliance` active vs expired
- Bar chart: `vw_university_compliance` study visa status

### Page 4: Alerts & IoT
- Matrix: `vw_alert_summary`
- Line chart: `vw_iot_scan_summary`

## Step 4: Alternative — REST API (Optional)

Use Power BI **Web** connector with authenticated endpoints:

- `GET /api/analytics/summary`
- `GET /api/analytics/expiry`
- `GET /api/analytics/verifications`

Note: Pass JWT token in Authorization header via Power BI parameter.

## Important Limitation

> DigiPermit is a compliance-monitoring platform. It does not issue official visas or replace government immigration authorities.
