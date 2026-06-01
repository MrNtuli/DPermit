# DigiPermit — Test Plan

**Project:** Major Capstone (DS3 × IS3 × IP2)  
**Version:** 1.0 | **Environment:** Local dev + Supabase cloud

---

## 1. Test scope

| Area | Tools |
|------|-------|
| REST API | Postman |
| Database integrity | Supabase Table Editor + SQL |
| Frontend UI | Manual browser testing |
| IoT simulation | Postman + UI |
| Role-based access | Manual + API 403 checks |
| Analytics | Power BI + `/api/analytics/*` |

---

## 2. Authentication tests

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| AUTH-01 | Valid login | POST `/api/auth/login` with hr@acmeglobal.demo | 200, token + profile |
| AUTH-02 | Invalid password | Wrong password | 401/400 error |
| AUTH-03 | Protected route | GET `/api/permits` without token | 401 |
| AUTH-04 | Profile fetch | GET `/api/auth/profile` with token | 200, role=employer_hr |

---

## 3. CRUD tests

| ID | Entity | Create | Read | Update | Delete/Archive |
|----|--------|--------|------|--------|--------------|
| CRUD-01 | Foreign national | POST as HR | GET list | PUT details | DELETE archive |
| CRUD-02 | Permit | POST capture | GET by id | PUT dates | PUT archive |
| CRUD-03 | Organisation | POST as admin | GET list | PUT name | DELETE deactivate |
| CRUD-04 | Permit type | POST as admin | GET list | PUT description | DELETE deactivate |

---

## 4. Verification tests

| ID | Input | Expected result |
|----|-------|-----------------|
| VER-01 | WP-2024-ACME-001 | valid |
| VER-02 | WP-2023-ACME-003 | expired |
| VER-03 | WP-2024-ACME-004 | revoked |
| VER-04 | INVALID-999 | not_found |
| VER-05 | QR DIGIPERMIT:WP-2024-ACME-001 | valid |
| VER-06 | RFID RFID-ACME-001 | valid |
| VER-07 | Wrong QR value | suspicious |

Each verification must create a row in `verification_logs`.

---

## 5. IoT tests

| ID | Test | Expected |
|----|------|----------|
| IOT-01 | POST `/api/iot/simulate` rfid | 200 + iot_event in response |
| IOT-02 | GET `/api/iot/events` | List includes new event |
| IOT-03 | Expired permit RFID scan | expired result + alert |

---

## 6. Role access tests

| Role | Can access | Cannot access |
|------|------------|---------------|
| foreign_national | Own permits only | Other users' permits (403) |
| employer_hr | Org employees/permits | Admin user management |
| verification_officer | Verify endpoints | Permit edit |
| manager | Analytics read-only | CRUD write operations |

---

## 7. Analytics & AI tests

| ID | Endpoint | Expected |
|----|----------|----------|
| AN-01 | GET `/api/analytics/summary` | Counts match DB |
| AN-02 | GET `/api/analytics/ai-insights` | insights array + risk_level |
| AN-03 | Power BI `vw_expiring_permits` | Rows match API expiry |

---

## 8. UI smoke tests

| Page | Role | Check |
|------|------|-------|
| Login | Guest | Form submits, redirects to dashboard |
| HR Dashboard | employer_hr | Stats load |
| FN QR page | foreign_national | QR value displayed |
| Verification manual | verification_officer | Result card shows |
| Admin alerts | system_admin | Alert list loads |

---

## 9. Test results log (fill during execution)

| Date | Tester | Tests run | Pass | Fail | Notes |
|------|--------|-----------|------|------|-------|
| | | | | | |

---

## 10. Known limitations

- Email/SMS notifications not implemented (in-app only)
- Packet Tracer simulates connectivity; HTTP sent from PC
- DigiPermit does not issue official government permits
