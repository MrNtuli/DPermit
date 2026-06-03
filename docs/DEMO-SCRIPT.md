# DigiPermit Demo Script

## Demo Credentials

**Password for all demo users:** `Demo@12345`

| Role | Email |
|------|-------|
| System Admin | admin@digipermit.demo |
| Employer HR | hr@acmeglobal.demo |
| Foreign National (Employee) | james.okonkwo@demo.mail |
| Foreign National (Employee 2) | priya.sharma@demo.mail |
| University Officer | international@metrouni.demo |
| International Student | maria.santos@demo.mail |
| Clinic Admin | admin@citywellness.demo |
| Verification Officer | verify@digipermit.demo |
| Immigration Officer | compliance@digipermit.demo |
| Manager/Auditor | audit@natcompliance.demo |

## Demo Permit Numbers

| Permit Number | Status | Use Case |
|---------------|--------|----------|
| WP-2024-ACME-001 | Active/Valid | Valid verification demo |
| WP-2024-ACME-002 | Expiring soon | Expiry countdown demo |
| WP-2023-ACME-003 | Expired | Expired verification demo |
| WP-2024-ACME-004 | Revoked | Revoked verification demo |
| SV-2024-METRO-001 | Active | Study visa demo |

## Live QR Code Demo (real camera scan)

DigiPermit generates a **scannable QR code** on each permit card. The QR encodes the value stored in the database (e.g. `DIGIPERMIT:WP-2024-ACME-001`).

### Employee side
1. Log in as `james.okonkwo@demo.mail`
2. Open **My Permits** → select a permit → **Digital Permit** page
3. Show the **QR code image** on screen (or print/screenshot it)

### Verification officer side
1. Log in as `verify@digipermit.demo`
2. Open **QR Scan** (Verification menu)
3. Click **Start Camera Scan** — allow camera when prompted
4. Point the camera at the employee's QR code on another device/screen
5. System verifies in real time and shows Valid / Expired / Revoked

**Tip for presentation:** Open James's QR on a phone; scan with the verification officer laptop webcam.

> These are **fictional compliance records**, not official government permits.

## 23-Step Demonstration Flow

1. **Log in as HR Officer** (`hr@acmeglobal.demo`)
2. Navigate to **Foreign Employees** → Register a new employee (or view existing)
3. Navigate to **Permit Records** → Capture a work-visa record
4. **Log out** → **Log in as Foreign National** (`james.okonkwo@demo.mail`)
5. View **My Dashboard** → see permit summary
6. Open **My Permits** → select a permit
7. View **Digital QR Code** page
8. Observe **expiry countdown**
9. Check **Notifications** for expiry reminders
10. **Log out** → **Log in as Verification Officer** (`verify@digipermit.demo`)
11. Open **Manual Lookup** → enter `WP-2024-ACME-001` → show **Valid** result
12. Verify expired permit: `WP-2023-ACME-003` → show **Expired** result
13. Show alert generation (automatic on scan)
14. Verify revoked permit: `WP-2024-ACME-004` → show **Revoked** result
15. Open **RFID Simulation** → device + `RFID-ACME-001`
16. **Log in as System Admin** (`admin@digipermit.demo`)
17. View **Alerts** page → see scan-generated alerts
18. View **Verification Logs**
19. Open **Admin Dashboard** → platform statistics
20. **Log in as University Officer** (`international@metrouni.demo`)
21. View international student study visa monitoring
22. Demonstrate RFID scan via IoT simulation page
23. Open **Power BI** connected to Supabase views (see POWER-BI-SETUP.md)

## Important Limitation Statement

> DigiPermit is a compliance-monitoring and verification platform. It does not issue official visas or immigration permits, and it does not replace the Department of Home Affairs or any official immigration authority.
