// DigiPermit Power BI — Power Query (M) scripts
// Paste each block in Power BI Desktop: Home → Transform data → New Source → Blank Query → Advanced Editor
// Replace Server, Database, User, Password with your Supabase connection details.
// Supabase: Settings → Database → Connection string (use Session pooler or Direct connection)

// ========== SHARED: PostgreSQL connection function ==========
/*
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres", [
        CreateNavigationProperties = false
    ])
in
    Source
*/

// ========== QUERY 1: Permit Status Summary ==========
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres"),
    vw_permit_status_summary = Source{[Schema="public",Item="vw_permit_status_summary"]}[Data]
in
    vw_permit_status_summary

// ========== QUERY 2: Expiring Permits ==========
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres"),
    vw_expiring_permits = Source{[Schema="public",Item="vw_expiring_permits"]}[Data]
in
    vw_expiring_permits

// ========== QUERY 3: Verification Summary ==========
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres"),
    vw_verification_summary = Source{[Schema="public",Item="vw_verification_summary"]}[Data]
in
    vw_verification_summary

// ========== QUERY 4: Alert Summary ==========
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres"),
    vw_alert_summary = Source{[Schema="public",Item="vw_alert_summary"]}[Data]
in
    vw_alert_summary

// ========== QUERY 5: Employer Compliance ==========
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres"),
    vw_employer_compliance = Source{[Schema="public",Item="vw_employer_compliance"]}[Data]
in
    vw_employer_compliance

// ========== QUERY 6: University Compliance ==========
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres"),
    vw_university_compliance = Source{[Schema="public",Item="vw_university_compliance"]}[Data]
in
    vw_university_compliance

// ========== QUERY 7: IoT Scan Summary ==========
let
    Source = PostgreSQL.Database("db.uafgtzemigqphejuscsu.supabase.co", "postgres"),
    vw_iot_scan_summary = Source{[Schema="public",Item="vw_iot_scan_summary"]}[Data]
in
    vw_iot_scan_summary
