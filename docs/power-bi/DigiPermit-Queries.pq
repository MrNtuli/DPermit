// DigiPermit Power BI — Power Query (M) for LIVE Supabase
// Guide: POWER-BI-LIVE-SUPABASE.md
//
// 1. Create parameters (Home → Manage Parameters):
//    - PBI_Server = your SESSION POOLER host from Supabase Database settings
//      e.g. aws-0-eu-central-1.pooler.supabase.com
//      (NOT the API URL; prefer pooler over db.uafgtzemigqphejuscsu.supabase.co on Windows)
//    - PBI_Database = postgres
//
// 2. First run prompts for Database auth:
//    User: postgres.uafgtzemigqphejuscsu  (pooler)  OR  postgres  (direct)
//    Password: Supabase → Project Settings → Database → Database password
//
// 3. Paste ONE query below per blank query, or use Get Data → PostgreSQL and tick views in Navigator.

// ========== Shared connection (reference query — name it "SupabaseSource") ==========
/*
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database, [CreateNavigationProperties = false])
in
    Source
*/

// ========== QUERY: Permit Status Summary ==========
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database),
    vw_permit_status_summary = Source{[Schema="public", Item="vw_permit_status_summary"]}[Data]
in
    vw_permit_status_summary

// ========== QUERY: Expiring Permits ==========
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database),
    vw_expiring_permits = Source{[Schema="public", Item="vw_expiring_permits"]}[Data]
in
    vw_expiring_permits

// ========== QUERY: Verification Summary ==========
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database),
    vw_verification_summary = Source{[Schema="public", Item="vw_verification_summary"]}[Data]
in
    vw_verification_summary

// ========== QUERY: Alert Summary ==========
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database),
    vw_alert_summary = Source{[Schema="public", Item="vw_alert_summary"]}[Data]
in
    vw_alert_summary

// ========== QUERY: Employer Compliance ==========
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database),
    vw_employer_compliance = Source{[Schema="public", Item="vw_employer_compliance"]}[Data]
in
    vw_employer_compliance

// ========== QUERY: University Compliance ==========
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database),
    vw_university_compliance = Source{[Schema="public", Item="vw_university_compliance"]}[Data]
in
    vw_university_compliance

// ========== QUERY: IoT Scan Summary ==========
let
    Source = PostgreSQL.Database(PBI_Server, PBI_Database),
    vw_iot_scan_summary = Source{[Schema="public", Item="vw_iot_scan_summary"]}[Data]
in
    vw_iot_scan_summary

// --- Direct connection fallback (if pooler unavailable) ---
// Replace PBI_Server with: "db.uafgtzemigqphejuscsu.supabase.co"
// User when prompted: postgres
