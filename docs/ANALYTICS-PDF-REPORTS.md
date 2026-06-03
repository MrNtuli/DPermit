# Analytics PDF reports (in-app)

DigiPermit dashboards include **PDF report** export for capstone demos and lecturer review.

## Where to find it

On any page with **Analytics Filters** (Admin, Manager, Employer, University, Immigration, Verification dashboards):

1. Set filters (period, scan type, outcome, organisation if available).
2. Tap **Refresh data** so charts match live data.
3. Tap **PDF report**.

The file downloads to your device (e.g. `DigiPermit-Analytics-Verification-Officer-2026-06-03.pdf`).

## What the PDF contains

- Report header (DigiPermit branding)
- User role and applied filters
- KPI summary table (same metrics as dashboard cards)
- Data tables for permit status, verification trend, results, and alerts (when in scope)
- Recent verifications sample (verification dashboard only)
- Chart appendix (screenshots of visible Chart.js graphs)
- Footer noting academic simulation and generation time

## Demo talking point

> “Analytics are live from Supabase; officers and managers can export the **same filtered view** as a PDF for audit or management review—similar to executive reporting in Power BI, but generated inside the portal.”

## Related

- Power BI: `docs/power-bi/POWER-BI-LIVE-SUPABASE.md` (external BI)
- Verification certificate PDF: Manual / QR verify result screen
