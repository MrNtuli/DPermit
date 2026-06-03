# DigiPermit — Role User Stories & Testing Guide

**Project:** DigiPermit — Multi-User Foreign-National Visa & Permit Compliance Monitoring System  
**Purpose:** Role-by-role user stories with test steps for manual acceptance testing  
**Login URL:** http://localhost:4200/login  
**Demo password (all users):** `Demo@12345`

> **Limitation:** DigiPermit is a compliance-monitoring platform. It does not issue official visas or replace government immigration authorities.

---

## Demo Accounts Quick Reference

| Role | Email | Organisation |
|------|-------|--------------|
| System Administrator | admin@digipermit.demo | Platform-wide |
| Employer HR | hr@acmeglobal.demo | Acme Global Industries |
| Foreign National (employee) | james.okonkwo@demo.mail | Acme Global |
| Foreign National (employee) | priya.sharma@demo.mail | Acme Global |
| University Officer | international@metrouni.demo | Metro University |
| Foreign National (student) | maria.santos@demo.mail | Metro University |
| Clinic Administrator | admin@citywellness.demo | City Wellness Clinic |
| Verification Officer | verify@digipermit.demo | DigiPermit Immigration Office (sim.) |
| Immigration Officer | compliance@digipermit.demo | DigiPermit Immigration Office (sim.) |
| Manager / Auditor | audit@natcompliance.demo | National Compliance Consultancy |

---

## 1. System Administrator

**Purpose:** Govern the platform — organisations, users, global data, and oversight.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| ADM-01 | As an admin, I want to see platform-wide statistics, so that I know overall compliance health. | Login → Dashboard | Cards show orgs, users, permits, alerts counts |
| ADM-02 | As an admin, I want to list organisations, so that I can see all tenants. | Organisations | Acme, Metro Uni, Clinic, etc. appear |
| ADM-03 | As an admin, I want to create user accounts and assign roles, so that access is controlled (FR-3.1). | Users → + → create user with role + org | User appears in list; can log in |
| ADM-04 | As an admin, I want to view all permits across orgs, so that I can oversee records. | All Permits | Seeded permits listed (e.g. WP-2024-ACME-001) |
| ADM-05 | As an admin, I want to view alerts, so that I can monitor critical issues. | Alerts | Open alerts (expired, revoked scan, etc.) |
| ADM-06 | As an admin, I want to view verification logs, so that I have an audit trail. | Verification Logs | Past verifications listed |
| ADM-07 | As an admin, I want to view analytics data, so that I can support reporting. | Analytics | JSON sections load |
| ADM-08 | As an admin, I want to manage IoT devices, so that RFID simulation is configured. | IoT Devices | Device list loads |

**Negative test:** Log in as HR → try `/admin/users` → must not access admin area.

---

## 2. Employer HR Officer

**Purpose:** Register employees, capture work visas, monitor organisation compliance.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| HR-01 | As HR, I want a dashboard of my org's compliance, so that I see risk at a glance. | Login hr@acmeglobal.demo → Dashboard | Stats: employees, active/expiring/expired visas |
| HR-02 | As HR, I want to register a foreign employee, so that compliance records are centralised. | Foreign Employees → + → register | Employee appears in list |
| HR-03 | As HR, I want to capture a work-visa record, so that expiry can be monitored. | Permit Records → + → capture form | Permit saved; appears in list with QR |
| HR-04 | As HR, I want to open a digital permit document, so that it can be printed at a checkpoint. | Permit Records → document icon on WP-2024-ACME-001 | Permit card + QR; PDF/print works |
| HR-05 | As HR, I want to verify a permit manually, so that I can check validity on site. | Verify Permit → WP-2024-ACME-001 | Result: Valid |
| HR-06 | As HR, I want to review renewal requests, so that employee updates are handled. | Renewal Requests | Requests listed; Approve works |
| HR-07 | As HR, I want to see org alerts, so that I act on expiries and issues. | Alerts | Acme-related alerts visible |

**Demo data:** James (WP-2024-ACME-001 valid), Priya (WP-2024-ACME-002 expiring soon).

**Negative test:** HR cannot open Admin → Users.

---

## 3. Foreign National

**Purpose:** Self-service view of own permits — status, QR, notifications.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| FN-01 | As a foreign national, I want to see my permit summary, so that I know my compliance status. | Login james.okonkwo@demo.mail → My Dashboard | James's permits with status badges |
| FN-02 | As a foreign national, I want to view all my permits, so that I can check expiry dates. | My Permits | Only James's records (not Priya's) |
| FN-03 | As a foreign national, I want a scannable QR permit document, so that I can present it at verification. | My Permits → View Permit Document | QR visible; download PDF/PNG works |
| FN-04 | As a foreign national, I want to read notifications, so that I am warned about expiry. | Notifications | Messages load; tap marks read |
| FN-05 | As a foreign national, I want to see my renewal request history, so that I know what is pending. | Update Requests | James's renewal request with status |

**Also test:** maria.santos@demo.mail → study visa SV-2024-METRO-001, not Acme work visas.

**Negative test:** James must not see other employees' permits or admin menus.

---

## 4. University International-Office Officer

**Purpose:** Manage students and study visas for Metro University.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| UNI-01 | As a university officer, I want a dashboard for student visa compliance, so that I monitor enrolment risk. | Login international@metrouni.demo → Dashboard | Stats load |
| UNI-02 | As a university officer, I want to list foreign students, so that I manage their records. | Students | Maria Santos, Chen Wei, Sofia Petrov |
| UNI-03 | As a university officer, I want to view study-visa permits, so that I track validity. | Study Visas | SV-2024-METRO-001, SV-2024-METRO-002 |
| UNI-04 | As a university officer, I want to register a new student, so that records stay centralised. | Students → register (optional) | New student in list |
| UNI-05 | As a university officer, I want to see alerts for my institution, so that I respond to expiries. | Alerts | University-related alerts |

---

## 5. Clinic Administrator

**Purpose:** Manage patients and medical-treatment visa records for City Wellness Clinic.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| CLI-01 | As a clinic admin, I want a compliance dashboard, so that I oversee patient visa records. | Login admin@citywellness.demo → Dashboard | Stats load |
| CLI-02 | As a clinic admin, I want to list foreign nationals under care, so that records are organised. | Foreign Nationals | Ahmed Hassan and clinic patients |
| CLI-03 | As a clinic admin, I want to view permit records, so that I monitor treatment visas. | Permit Records | MT-2024-CLINIC-001 (pending verification) |
| CLI-04 | As a clinic admin, I want to capture a new permit record, so that new patients are tracked. | Permit Records → + (optional) | New permit saved |

**Link to immigration test:** MT-2024-CLINIC-001 is pending_verification — use for IMM-02.

---

## 6. Verification Officer

**Purpose:** Checkpoint verification — manual, QR, RFID — with printable proof.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| VER-01 | As a verification officer, I want a verification hub, so that I choose how to verify. | Login verify@digipermit.demo → Verification | Manual / QR / RFID buttons visible |
| VER-02 | As a verification officer, I want to verify by permit number, so that I can check without QR. | Manual Lookup → WP-2024-ACME-001 | Result Valid + certificate |
| VER-03 | As a verification officer, I want to scan a QR code, so that checkpoint verification is fast. | QR Scan → DIGIPERMIT:WP-2024-ACME-001 or camera | Result Valid |
| VER-04 | As a verification officer, I want to detect bad documents, so that compliance risk is flagged. | WP-2023-ACME-003 → Expired; WP-2024-ACME-004 → Revoked | Correct result + warning |
| VER-05 | As a verification officer, I want to download/print a verification certificate, so that I keep checkpoint proof. | After verify → Download PDF / Print | PDF saves; print shows certificate |
| VER-06 | As a verification officer, I want to simulate RFID scans, so that IoT integration is demonstrated. | RFID Simulation → device + RFID-ACME-001 | Valid result logged |
| VER-07 | As a verification officer, I want to view recent verification logs, so that I have an audit trail. | Recent Logs | Scans appear in list |

**Negative test:** Verification officer cannot edit permits or manage users.

---

## 7. Immigration / Senior Compliance Officer (Simulated)

**Purpose:** Review pending records, validate/reject, monitor suspicious activity.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| IMM-01 | As an immigration officer, I want a review dashboard, so that I see pending work. | Login compliance@digipermit.demo → Review Dashboard | Pending, renewals, alerts counts |
| IMM-02 | As an immigration officer, I want to validate pending permits, so that records become active. | Pending Permits → Validate MT-2024-CLINIC-001 | Permit validated |
| IMM-03 | As an immigration officer, I want to reject incorrect records, so that bad data is blocked. | Pending Permits → Reject | Status rejected |
| IMM-04 | As an immigration officer, I want to view suspicious activity, so that I investigate anomalies. | Suspicious Records | QR mismatch, revoked scans listed |
| IMM-05 | As an immigration officer, I want to see compliance alerts, so that I prioritise cases. | Alerts | Critical/high alerts listed |

---

## 8. Manager / Auditor

**Purpose:** Read-only executive view — analytics and reports, no CRUD.

| ID | User Story | Test Steps | Pass If |
|----|------------|------------|---------|
| MGR-01 | As a manager, I want a compliance overview, so that I make informed decisions. | Login audit@natcompliance.demo → Analytics | Summary cards + data sections |
| MGR-02 | As a manager, I want AI-style executive insights, so that I see risk and recommendations. | Reports → Generate Insight Summary | Risk level, insights, recommendations |
| MGR-03 | As a manager, I want raw compliance summary data, so that I can export to Power BI. | Reports → Load Summary | JSON summary displays |
| MGR-04 | As an auditor, I want read-only access with no edit menus, so that governance is preserved. | Check sidebar | Only Analytics + Reports + Profile |

**Negative test:** Manager cannot register employees, capture permits, or create users.

---

## End-to-End Test Sequence (Recommended Demo Order)

| Step | Role | Story ID | What It Proves |
|------|------|----------|------------------|
| 1 | Admin | ADM-03 | Controlled user provisioning |
| 2 | HR | HR-02 + HR-03 | Org onboarding (UC-01) |
| 3 | Admin | ADM-03 | Link FN login to employee (FR-4.3) |
| 4 | Foreign National | FN-03 | Employee carries digital permit + QR |
| 5 | Verification Officer | VER-03 + VER-05 | QR scan + PDF certificate |
| 6 | Immigration Officer | IMM-02 | Pending permit validation |
| 7 | Manager | MGR-02 | Executive oversight |
| 8 | Admin | ADM-06 | Audit trail complete |

---

## Demo Permit Numbers for Verification Tests

| Permit Number | QR Value | Expected Result |
|---------------|----------|-----------------|
| WP-2024-ACME-001 | DIGIPERMIT:WP-2024-ACME-001 | valid |
| WP-2024-ACME-002 | DIGIPERMIT:WP-2024-ACME-002 | expiring_soon |
| WP-2023-ACME-003 | DIGIPERMIT:WP-2023-ACME-003 | expired |
| WP-2024-ACME-004 | DIGIPERMIT:WP-2024-ACME-004 | revoked |
| INVALID-999 | — | not_found |

---

## Test Results Log

| Role | Stories Tested | Pass | Fail | Notes |
|------|----------------|------|------|-------|
| System Admin | ADM-01–08 | | | |
| Employer HR | HR-01–07 | | | |
| Foreign National | FN-01–05 | | | |
| University Officer | UNI-01–05 | | | |
| Clinic Admin | CLI-01–04 | | | |
| Verification Officer | VER-01–07 | | | |
| Immigration Officer | IMM-01–05 | | | |
| Manager/Auditor | MGR-01–04 | | | |

---

## Known Limitations (Not Test Failures)

- Foreign national submit update request: view history works; submit form not in UI (API exists).
- Email/SMS notifications: in-app only.
- Auditor role uses same demo account as Manager (audit@natcompliance.demo).
- Power BI dashboard: SQL views exist; dashboard built separately in Power BI Desktop.

---

*DigiPermit Capstone — DS3 × IS3 × IP2*
