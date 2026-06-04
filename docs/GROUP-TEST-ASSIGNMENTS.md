# DigiPermit — Team Role Assignments & Test Plan

**Purpose:** Each group member owns **one role**, tests it on the **live app**, and prepares **one demo moment** for presentation day.

**Do not skip the “Pass if” section** — that is how we know you are ready.

---

## Your team roster (8 members — one role each)

| # | Name | Student no. | Role | Login email |
|---|------|-------------|------|-------------|
| 1 | **Mhle** | 22322987 | System Administrator | `admin@digipermit.demo` |
| 2 | **TV Manqele** | 22304993 | Employer HR | `hr@acmeglobal.demo` |
| 3 | **SK Ngubane** | 22433510 | Foreign National (Employee) | `james.okonkwo@demo.mail` |
| 4 | **S Dube** | 22322900 | Verification Officer | `verify@digipermit.demo` |
| 5 | **KS Cebekhulu** | 22322695 | Immigration Officer | `compliance@digipermit.demo` |
| 6 | **O Luthuli** | 22325286 | Manager / Auditor | `audit@natcompliance.demo` |
| 7 | **SS Mathonsi** | 22339617 | University Officer | `international@metrouni.demo` |
| 8 | **NN Dlodlo** | 22325063 | Clinic Administrator | `admin@citywellness.demo` |

**Password for every login above:** `Demo@12345`

### Who tests what (quick lookup)

| If your name is… | Open role card… | Presentation step |
|------------------|-----------------|-------------------|
| TV Manqele | **ROLE B — Employer HR** | Step 1 (speak first) |
| SK Ngubane | **ROLE C — Foreign National** | Step 2 — show QR on phone |
| S Dube | **ROLE D — Verification Officer** | Step 3 — scan SK’s QR |
| KS Cebekhulu | **ROLE E — Immigration Officer** | Step 4 — validate clinic permit |
| Mhle | **ROLE A — System Administrator** | Step 5 — logs + analytics |
| SS Mathonsi | **ROLE G — University Officer** | Step 6a — Metro University |
| NN Dlodlo | **ROLE H — Clinic Administrator** | Step 6b — City Wellness Clinic |
| O Luthuli | **ROLE F — Manager / Auditor** | Step 7 — insight report |

**Practice together:** SK Ngubane + S Dube must rehearse the **phone QR scan** before demo day.

---

## 1. Shared setup (everyone)

| | |
|---|---|
| **App URL** | https://mrntuli.github.io/DPermit/ |
| **Password** | `Demo@12345` (same for every account below) |
| **If login is slow** | Wait up to 60 seconds (free server waking up), then try again |
| **Rule** | DigiPermit monitors compliance — it does **not** issue real government visas |

### What each member must deliver

1. Complete **your role card** below (all required steps).
2. Take **one screenshot** of your main success screen.
3. Post in the group chat using the **report template** at the bottom.
4. Learn **your demo line** — you will say it during the live presentation.

---

## 2. Role assignments (confirmed)

Your team has **8 members** — each person takes **one role** from the roster above.

| Role | Assign to | Login |
|------|-----------|-------|
| System Administrator | **Mhle** (22322987) | `admin@digipermit.demo` |
| Employer HR | **TV Manqele** (22304993) | `hr@acmeglobal.demo` |
| Foreign National | **SK Ngubane** (22433510) | `james.okonkwo@demo.mail` |
| Verification Officer | **S Dube** (22322900) | `verify@digipermit.demo` |
| Immigration Officer | **KS Cebekhulu** (22322695) | `compliance@digipermit.demo` |
| Manager / Auditor | **O Luthuli** (22325286) | `audit@natcompliance.demo` |
| University Officer | **SS Mathonsi** (22339617) | `international@metrouni.demo` |
| Clinic Administrator | **NN Dlodlo** (22325063) | `admin@citywellness.demo` |

*Alternative splits (4-person teams) are not needed — use the roster above.*

---

## 3. How the demo fits together (read once as a team)

This is the **story** we present. Each person owns their step.

```
Step  Who                    What happens
────  ─────────────────────  ──────────────────────────────────────────
 1    TV Manqele (HR)       Captures a work-visa record for an employee
 2    SK Ngubane (FN)       Opens digital permit with QR on phone
 3    S Dube (Verifier)      Scans QR → Valid; then Expired + Revoked
 4    KS Cebekhulu (Imm.)   Validates pending clinic permit MT-2024-CLINIC-001
 5    Mhle (Admin)           Shows alerts + verification logs + analytics filters
 6    SS Mathonsi (Uni)      Metro University study visas (90 sec)
      NN Dlodlo (Clinic)     City Wellness patient permits (90 sec)
 7    O Luthuli (Manager)    Executive insight report (read-only)
 8    Mhle or any member     States limitation: not official Home Affairs
```

**Linked moment (Steps 2 + 3):** **SK Ngubane** shows QR on phone → **S Dube** scans with laptop camera. Rehearse this together before demo day.

---

## 4. Role cards — test exactly this

Each card follows the same pattern: **Responsibility → Steps → Pass if → Demo line**.

---

### ROLE A — System Administrator  
**Assigned to: Mhle (22322987)**

| | |
|---|---|
| **Login** | `admin@digipermit.demo` |
| **You are responsible for** | Proving the platform is governed centrally — users, organisations, logs, and cross-org analytics. |
| **You prove (spec)** | RBAC, audit trail, analytics filters (IS3 reporting requirement). |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | Dashboard | Open after login | Counts for organisations, users, permits, alerts |
| 2 | Organisations | Open list | Acme Global, Metro University, City Wellness Clinic |
| 3 | Users | Open list | Demo users with roles (do **not** delete accounts) |
| 4 | All Permits | Search `WP-2024-ACME-001` | Permit appears |
| 5 | Alerts | Open page | At least one alert listed |
| 6 | Verification Logs | Open page | Past verification entries |
| 7 | Analytics | Change **organisation** and **period** filters | Charts and KPI cards update |
| 8 | IoT Devices | Open page | Device list loads |

#### Security check (required)

Log out → log in as `hr@acmeglobal.demo` → try to open **Admin → Users** → **must be blocked**.

#### Pass if

- [ ] All 8 steps show expected data  
- [ ] Analytics filters change the charts  
- [ ] HR cannot access admin pages  

#### Your demo line (say this on presentation day)

> “As system admin, I govern all organisations, review audit logs, and filter analytics across the whole platform.”

---

### ROLE B — Employer HR  
**Assigned to: TV Manqele (22304993)**

| | |
|---|---|
| **Login** | `hr@acmeglobal.demo` |
| **Organisation** | Acme Global Industries only |
| **You are responsible for** | Proving an employer can register employees, capture permits, and verify on site. |
| **You prove (spec)** | Core use case UC-01 — employer onboarding and compliance monitoring. |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | Dashboard | Open | Acme employee/visa stats only |
| 2 | Foreign Employees | Open list | James Okonkwo, Priya Sharma |
| 3 | Permit Records | Open `WP-2024-ACME-001` | Active permit with details |
| 4 | Permit Records → Document icon | Open digital permit | QR code + print/PDF option |
| 5 | Verify Permit → Manual | Enter `WP-2024-ACME-001` | Result: **Valid** |
| 6 | Verify Permit → QR Scan | Enter `DIGIPERMIT:WP-2024-ACME-001` | Result: **Valid** |
| 7 | Alerts | Open | Alerts for Acme only |
| 8 | Renewal Requests | Open | Request list loads |

#### Security check (required)

Confirm sidebar has **no Admin menu** and you **cannot** see Metro University students.

#### Pass if

- [ ] All Acme data loads  
- [ ] QR document displays  
- [ ] Manual + QR verification both return Valid  
- [ ] No access to other organisations  

#### Your demo line

> “HR registers foreign employees, captures visa records, and can verify permits manually or by QR — the same capability we give university and clinic officers.”

---

### ROLE C — Foreign National (Employee)  
**Assigned to: SK Ngubane (22433510)**

| | |
|---|---|
| **Login** | `james.okonkwo@demo.mail` |
| **You are responsible for** | Proving employees only see **their own** permits and can present a scannable QR. |
| **You prove (spec)** | Self-service portal + digital permit document (FR employee view). |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | My Dashboard | Open | James’s permits only |
| 2 | My Permits | Open list | James’s records — **not** Priya’s |
| 3 | My Permits → View document | Open digital permit | QR code visible |
| 4 | Digital permit | Download PDF or PNG | File saves successfully |
| 5 | Notifications | Open | Messages load; mark one as read |
| 6 | Update Requests | Open | James’s renewal history |

#### Coordination (required for demo)

**Before presentation:** open your QR on your phone. **Verification Officer (Role D)** will scan it live.

#### Pass if

- [ ] Only James’s data visible  
- [ ] QR displays and downloads  
- [ ] Notifications work  
- [ ] QR ready on phone for paired scan  

#### Your demo line

> “The foreign national carries a digital permit with a QR code they can show at any checkpoint.”

---

### ROLE D — Verification Officer  
**Assigned to: S Dube (22322900)**

| | |
|---|---|
| **Login** | `verify@digipermit.demo` |
| **You are responsible for** | Proving checkpoint verification works three ways and creates an audit trail. |
| **You prove (spec)** | Multi-channel verification — manual, QR, RFID (O4). |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | Verification hub | Open | Manual Lookup, QR Scan, RFID Simulation |
| 2 | Manual Lookup | `WP-2024-ACME-001` | **Valid** + certificate |
| 3 | Manual Lookup | `WP-2023-ACME-003` | **Expired** |
| 4 | Manual Lookup | `WP-2024-ACME-004` | **Revoked** |
| 5 | QR Scan | Scan James’s phone QR **or** paste `DIGIPERMIT:WP-2024-ACME-001` | **Valid** |
| 6 | After valid scan | Download PDF / Print | Certificate generated |
| 7 | RFID Simulation | Device + tag `RFID-ACME-001` | **Valid** |
| 8 | Recent Logs | Open | Your scans listed |

#### Security check (required)

Confirm you **cannot** edit permits or manage users.

#### Pass if

- [ ] Valid, Expired, and Revoked all return correct results  
- [ ] QR scan works (camera or paste)  
- [ ] Certificate downloads  
- [ ] Scans appear in Recent Logs  

#### Your demo line

> “We verify permits manually, by QR camera scan, and by simulated RFID — every scan is logged for audit.”

---

### ROLE E — Immigration Officer (Simulated)  
**Assigned to: KS Cebekhulu (22322695)**

| | |
|---|---|
| **Login** | `compliance@digipermit.demo` |
| **You are responsible for** | Proving pending permits must be reviewed before they become active. |
| **You prove (spec)** | Compliance workflow — validate / reject (immigration simulation). |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | Review Dashboard | Open | Pending / renewal / alert counts |
| 2 | Pending Permits | Find `MT-2024-CLINIC-001` | Status: **pending verification** |
| 3 | Pending Permits | Click **Validate** on `MT-2024-CLINIC-001` | Status becomes **active** |
| 4 | Suspicious Records | Open | Entries for bad scans / mismatches |
| 5 | Alerts | Open | Critical/high alerts listed |

#### Coordination

After you validate `MT-2024-CLINIC-001`, **Clinic Admin (Role H)** can verify it as Valid.

#### Pass if

- [ ] Pending permit found  
- [ ] Validation succeeds  
- [ ] Suspicious records and alerts load  

#### Your demo line

> “New permit records stay pending until an immigration officer validates them — this simulates real compliance review.”

---

### ROLE F — Manager / Auditor  
**Assigned to: O Luthuli (22325286)**

| | |
|---|---|
| **Login** | `audit@natcompliance.demo` |
| **You are responsible for** | Proving executives get **read-only** analytics and insight reports. |
| **You prove (spec)** | Executive oversight + AI-style insights (O6, IS3 analytics). |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | Analytics | Open | Summary cards + charts |
| 2 | Reports | Click **Generate Insight Summary** | Risk level + recommendations |
| 3 | Reports | Click **Load Summary** | Summary data displays |
| 4 | Sidebar | Check menus | **Only** Analytics, Reports, Profile |

#### Security check (required)

Confirm **no** Register Employee, Capture Permit, or Admin menus.

#### Pass if

- [ ] Analytics and insight report load  
- [ ] Account is clearly read-only  

#### Your demo line

> “Managers and auditors get read-only analytics and automated compliance insights — they cannot change records.”

---

### ROLE G — University Officer  
**Assigned to: SS Mathonsi (22339617)**

| | |
|---|---|
| **Login** | `international@metrouni.demo` |
| **Organisation** | Metro University only |
| **You are responsible for** | Proving universities monitor **study visas** separately from employers. |
| **You prove (spec)** | Multi-tenant system — university org scope. |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | Dashboard | Open | Student visa stats |
| 2 | Students | Open | Maria Santos, Chen Wei, Sofia Petrov |
| 3 | Study Visas | Open | `SV-2024-METRO-001`, `SV-2024-METRO-002` |
| 4 | Verify (manual or QR) | `SV-2024-METRO-001` | **Valid** |
| 5 | Alerts | Open | Metro University alerts only — **not** Acme data |

#### Pass if

- [ ] Students and study visas load  
- [ ] Verification returns Valid  
- [ ] No employer data visible  

#### Your demo line

> “Metro University monitors international students and study visas in their own isolated workspace.”

---

### ROLE H — Clinic Administrator  
**Assigned to: NN Dlodlo (22325063)**

| | |
|---|---|
| **Login** | `admin@citywellness.demo` |
| **Organisation** | City Wellness Clinic only |
| **You are responsible for** | Proving clinics track **medical treatment visas** the same way employers track work visas. |
| **You prove (spec)** | Third organisation type in multi-tenant design. |

#### Required steps

| # | Go to | Do this | You must see |
|---|-------|---------|--------------|
| 1 | Dashboard | Open | Clinic compliance stats |
| 2 | Foreign Nationals | Open | Patient list (e.g. Ahmed Hassan) |
| 3 | Permit Records | Find `MT-2024-CLINIC-001` | Pending **before** immigration validates; active **after** |
| 4 | Verify (manual or QR) | After Role E validates | Result: **Valid** |
| 5 | Sidebar / data | Check scope | City Wellness data only |

#### Coordination

Run step 3 **before** and **after** Immigration Officer (Role E) validates the permit.

#### Pass if

- [ ] Clinic patients and permits load  
- [ ] Permit moves from pending → active after validation  
- [ ] Verification works after validation  

#### Your demo line

> “The clinic tracks treatment visas for foreign patients — the same compliance model as employers and universities.”

---

## 5. Permit numbers — use these exact values

| Permit number | Use in test | Expected result |
|---------------|-------------|-----------------|
| `WP-2024-ACME-001` | Valid demo | Valid |
| `WP-2024-ACME-002` | Expiring demo | Expiring soon |
| `WP-2023-ACME-003` | Expired demo | Expired |
| `WP-2024-ACME-004` | Revoked demo | Revoked |
| `SV-2024-METRO-001` | Study visa demo | Valid |
| `MT-2024-CLINIC-001` | Immigration validate demo | Pending → Valid |

**QR value format:** `DIGIPERMIT:` + permit number  
**Example:** `DIGIPERMIT:WP-2024-ACME-001`

---

## 6. Presentation run sheet (who speaks when)

| Order | Speaker | Student no. | Time | Action |
|-------|---------|-------------|------|--------|
| 1 | **TV Manqele** | 22304993 | 3 min | HR: dashboard → employee → permit → QR document |
| 2 | **SK Ngubane** | 22433510 | 2 min | FN: show QR on phone |
| 3 | **S Dube** | 22322900 | 4 min | Verifier: scan QR → Valid; Expired + Revoked |
| 4 | **KS Cebekhulu** | 22322695 | 2 min | Immigration: validate `MT-2024-CLINIC-001` |
| 5 | **Mhle** | 22322987 | 3 min | Admin: alerts → logs → analytics filters |
| 6 | **SS Mathonsi** | 22339617 | 90 sec | University: Metro student visas |
| 6 | **NN Dlodlo** | 22325063 | 90 sec | Clinic: patient permits (after KS validates) |
| 7 | **O Luthuli** | 22325286 | 2 min | Manager: insight summary report |
| 8 | **Mhle** (or team) | 22322987 | 30 sec | “DigiPermit does not issue official government visas.” |

Full narrative: `docs/DEMO-SCRIPT.md`

---

## 7. Report back (copy into group chat)

Each member posts **one message** when done:

```
TEAM TEST REPORT
Name: _______________
Role assigned: _______________
Login used: _______________

Required steps: ___ / ___ completed
Pass if checklist: All ticked? YES / NO
Security check: PASS / FAIL
Screenshot attached: YES / NO
Issues found: _______________
Ready for live demo: YES / NO
```

---

## 8. Reference links

| Resource | Location |
|----------|----------|
| Live app | https://mrntuli.github.io/DPermit/ |
| Detailed test IDs | `docs/ROLE-USER-STORIES-TEST-GUIDE.md` |
| Demo script | `docs/DEMO-SCRIPT.md` |
| Submission PDFs | `docs/pdf/` |
