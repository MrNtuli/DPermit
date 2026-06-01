# Database Setup Guide

Run these files **in order** in the Supabase SQL Editor.

## Migrations (required)

1. `migrations/001_create_organisations.sql`
2. `migrations/002_create_foreign_nationals.sql`
3. `migrations/003_create_profiles.sql`
4. `migrations/004_create_permit_types.sql`
5. `migrations/005_create_permits.sql`
6. `migrations/006_create_renewal_update_requests.sql`
7. `migrations/007_create_notifications.sql`
8. `migrations/008_create_verification_logs.sql`
9. `migrations/009_create_alerts.sql`
10. `migrations/010_create_supporting_document_metadata.sql`
11. `migrations/011_create_iot_tables.sql`
12. `migrations/013_rls_policies.sql`

## Views (for analytics / Power BI)

13. `views/analytics_views.sql`

## Seed Data

14. `seeds/001_permit_types.sql`
15. `seeds/002_organisations.sql`
16. `seeds/003_foreign_nationals.sql`
17. `seeds/004_permits.sql`
18. `seeds/005_demo_data.sql`

## Demo Users (via backend)

After SQL seeds, run from backend folder:

```bash
npm run seed
```

This creates Supabase Auth users and links them to profiles.
