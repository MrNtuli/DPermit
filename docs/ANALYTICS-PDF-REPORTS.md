# Analytics PDF reports (in-app)

DigiPermit dashboards include **PDF report** export for capstone demos and lecturer review.

## Where to find it

On any page with **Analytics Filters** (Admin, Manager, Employer, University, Immigration, Verification dashboards):

1. Set filters (period, scan type, outcome, organisation if available).
2. Tap **Refresh data** so charts match live data.
3. Tap **PDF report**.

The file downloads to your device (e.g. `DigiPermit-Analytics-Verification-Officer-2026-06-03.pdf`).

## What the PDF contains

Content is **role-specific** (not one long generic report):

| Role | Typical PDF sections |
|------|----------------------|
| Verification officer | My scans, success/fail counts, activity days with scans only, results breakdown, up to 8 recent scans, verification charts |
| Employer / university / clinic | Organisation permit KPIs, permit status, verifications, alerts |
| Immigration / manager | Review-focused KPIs, permits, verifications, alerts |
| System admin | Platform-wide KPIs and all chart types in scope |

- Daily activity table lists **only days that had scans** (not empty rows).
- Zero metrics that do not apply to the role are omitted.
- Chart images match what that role sees on screen.

## Demo talking point

> “Analytics are live from Supabase; officers and managers can export the **same filtered view** as a PDF for audit or management review—similar to executive reporting in Power BI, but generated inside the portal.”

## Related

- Power BI: `docs/power-bi/POWER-BI-LIVE-SUPABASE.md` (external BI)
- Verification certificate PDF: Manual / QR verify result screen
