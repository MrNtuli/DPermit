# DigiPermit — Demo Registration & Permit Number Quick Reference

**DigiPermit Team · Live demonstration cheat sheet**

Password for **all** demo logins: `Demo@12345`  
Live app: https://mrntuli.github.io/DPermit/

> DigiPermit is a **compliance-monitoring** platform. It does not issue official visas. Passport and permit numbers are typed from real documents — for the demo we use **fictional** values that follow a simple pattern.

---

## 1. Who enters what (three steps)

| Step | Who logs in | Screen | What you type |
|------|-------------|--------|----------------|
| **1** | HR — `hr@acmeglobal.demo` | Foreign Employees | Passport, name, nationality (from **passport**) |
| **2** | HR | Permit Records | Permit number, dates (from **visa / work permit**) |
| **3** | Admin — `admin@digipermit.demo` | Users → Create | Login only — **link** existing employee (no permit number here) |

**Admin does not create permit numbers.** HR must complete steps 1 and 2 first, then admin links the record for a foreign national login.

---

## 2. Creating a NEW foreign national (copy-paste examples)

Use these when registering someone **new** during the presentation (not the pre-loaded seed data).

### Step 1 — HR: Register employee

**Menu:** Foreign Employees → Add

| Field | Type this |
|-------|-----------|
| Full name | `Demo Employee One` |
| Passport number | `FN20260001` |
| Nationality | `Nigerian` |
| Email | `demo.employee1@demo.mail` |
| Type | Employee |

**Passport rule:** any unique value, e.g. `FN` + year + sequence (`FN20260002` for a second person).

### Step 2 — HR: Capture work visa

**Menu:** Permit Records → Add → select **Demo Employee One**

| Field | Type this |
|-------|-----------|
| Permit type | General work visa |
| Permit number | `WP-2026-ACME-101` |
| Passport number | Fills automatically when you pick the employee |
| Issue date | `2025-01-01` |
| Expiry date | `2027-12-31` |

**Permit number pattern (easy to remember):**

`WP-2026-ACME-101`

- `WP` = work permit  
- `2026` = year  
- `ACME` = employer (Acme Global)  
- `101`, `102`, `103` = person number  

**QR code** (auto-generated): `DIGIPERMIT:WP-2026-ACME-101`

### Step 3 — Admin: Create login

**Menu:** Users → Create

| Field | Type this |
|-------|-----------|
| Full name | `Demo Employee One` |
| Email | `demo.employee1@demo.mail` |
| Password | `Demo@12345` |
| Role | Foreign national |
| Organisation | Acme Global |
| Link record | Demo Employee One · FN20260001 |

### Second new person (optional)

| Field | Person 2 |
|-------|----------|
| Passport | `FN20260002` |
| Permit number | `WP-2026-ACME-102` |
| Email | `demo.employee2@demo.mail` |

### One line for lecturers

> “We capture passport and permit details from physical immigration documents; today we use fictional references such as FN20260001 and WP-2026-ACME-101.”

---

## 3. Pre-loaded demo data (already in the system)

### Demo logins

| Role | Email |
|------|-------|
| System Admin | admin@digipermit.demo |
| Employer HR | hr@acmeglobal.demo |
| Foreign National (James) | james.okonkwo@demo.mail |
| Foreign National (Priya) | priya.sharma@demo.mail |
| University Officer | international@metrouni.demo |
| Student (Maria) | maria.santos@demo.mail |
| Clinic Admin | admin@citywellness.demo |
| Verification Officer | verify@digipermit.demo |
| Immigration Officer | compliance@digipermit.demo |
| Manager / Auditor | audit@natcompliance.demo |

### Verification — copy-paste permit numbers

| Demo story | Permit number | Expected result |
|------------|---------------|-----------------|
| Valid employee | `WP-2024-ACME-001` | Valid (James) |
| Expiring soon | `WP-2024-ACME-002` | Expiring soon (Priya) |
| Expired | `WP-2023-ACME-003` | Expired |
| Revoked | `WP-2024-ACME-004` | Revoked |
| Study visa | `SV-2024-METRO-001` | Valid (Maria) |
| Pending immigration | `MT-2024-CLINIC-001` | Pending verification |
| Not in system | `WP-9999-FAKE-001` | Not found |

**QR manual entry** (if camera fails): `DIGIPERMIT:WP-2024-ACME-001`

**RFID simulation:** tag `RFID-ACME-001` (matches `WP-2024-ACME-001`)

### Passport numbers (seed employees)

| Person | Passport | Login |
|--------|----------|-------|
| James Okonkwo | FN88291034 | james.okonkwo@demo.mail |
| Priya Sharma | FN77382910 | priya.sharma@demo.mail |
| Maria Santos | FN66473829 | maria.santos@demo.mail |
| Ahmed Hassan (clinic) | FN44655647 | — |
| Chen Wei (student) | FN55564738 | — |

### All seeded permit numbers

**Acme Global (work permits)**

- WP-2024-ACME-001 — active  
- WP-2024-ACME-002 — expiring soon  
- WP-2023-ACME-003 — expired  
- WP-2024-ACME-004 — revoked  
- WP-2025-ACME-005 — rejected  
- PR-2024-ACME-001 — renewal in progress  

**Metro University**

- SV-2024-METRO-001 — active  
- SV-2024-METRO-002 — expiring soon  
- VV-2024-METRO-001 — visitor, active  

**City Wellness Clinic**

- MT-2024-CLINIC-001 — pending verification  

---

## 4. Suggested 60-second verification demo

1. Log in as `verify@digipermit.demo`  
2. **Manual Lookup** → `WP-2024-ACME-001` → show **Valid**  
3. Same screen → `WP-2023-ACME-003` → show **Expired**  
4. **QR Scan** → open James’s QR on a phone, or paste `DIGIPERMIT:WP-2024-ACME-001`  

---

## 5. Printable sample permits (same look as the app)

Pre-generated **digital permit cards** (green header, QR, disclaimer banner) — use for props or phone screenshots during QR demo:

| File | Person / permit |
|------|-----------------|
| `docs/demo-permits/WP-2026-ACME-101-NEW-EMPLOYEE.pdf` | New demo employee |
| `docs/demo-permits/WP-2024-ACME-001-JAMES-OKONKWO.pdf` | James — valid scan |
| `docs/demo-permits/WP-2024-ACME-002-PRIYA-SHARMA.pdf` | Priya — expiring soon |
| `docs/demo-permits/SV-2024-METRO-001-MARIA-SANTOS.pdf` | Maria — study visa |
| `docs/pdf/DEMO-SAMPLE-PERMITS.pdf` | All of the above in one PDF |

Regenerate: `python scripts/generate-demo-permit-pdfs.py`

After HR captures a new permit in the app, the employee can also open **My Permits → View Permit Document** for the live on-screen version (identical layout).

---

## 6. Organisation prefix guide (new permits)

| Organisation | Permit prefix example |
|--------------|----------------------|
| Acme Global (employer) | WP-2026-ACME-### |
| Metro University | SV-2026-METRO-### |
| City Wellness Clinic | MT-2026-CLINIC-### |

---

*DigiPermit — Academic capstone project. Fictional data for demonstration only.*
