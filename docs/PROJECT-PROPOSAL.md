# DigiPermit — Project Proposal Document

**Module Integration:** DS3 × IS3 × IP2  
**Project Title:** DigiPermit: A Multi-User Foreign-National Visa and Permit Compliance Monitoring System  
**Document Length:** 8–12 pages (export to PDF for submission)  
**Version:** 1.0

---

## 1. Problem Statement & Strategic Context

Organisations that employ, educate, or treat foreign nationals must monitor immigration-related documents (work visas, study visas, residence permits) for validity and expiry. Current practice relies heavily on **manual spreadsheets and email reminders**, which causes:

- Missed permit expiry dates and delayed renewals  
- Continued employment or enrolment without valid compliance records  
- No real-time verification at security checkpoints  
- No structured audit trail for verification attempts  
- Inconsistent access control over sensitive personal data  

**Strategic context:** In a digital firm, compliance data must be automated, integrated with operational workflows, supported by real-time IoT-style verification, stored in a normalised database, and analysed for executive decision-making.

> **DigiPermit limitation:** The system monitors and verifies compliance records only. It does not issue official visas or replace government immigration authorities.

### 1.1 BPMN 2.0 As-Is Process (IS3)

See full diagram: `docs/IS3-BPMN-PROCESS-MODELS.md`

**Summary:** HR receives visa documentation → enters spreadsheet → periodically checks expiry → sends informal email → risk of expired permits going unnoticed.

**Primary bottleneck selected for automation:** Manual expiry date monitoring (B1).

### 1.2 BPMN 2.0 To-Be Process (IS3)

DigiPermit automates capture, validation, daily expiry checks, notifications, multi-channel verification (manual/QR/RFID), and audit logging.

---

## 2. Target Users & Stakeholders

| Stakeholder | Need |
|-------------|------|
| Employer HR | Monitor employee work visas |
| University international office | Monitor study visas |
| Clinic/hospital admin | Patient/employee document records |
| Foreign national | Self-service visibility, QR code, renewal requests |
| Verification officer | Checkpoint permit verification |
| Immigration officer (simulated) | Validate/reject captured records |
| System administrator | Platform governance |
| Manager/auditor | Read-only analytics |

---

## 3. System Objectives

1. Reduce risk of expired or invalid permits being overlooked  
2. Provide secure role-based access across eight user types  
3. Automate expiry notifications at 90, 60, 30, 14, 7, 1, 0, and post-expiry intervals  
4. Enable verification by permit number, QR code, and simulated RFID  
5. Store immutable verification and IoT scan audit trails  
6. Deliver Power BI executive dashboards from normalised data  
7. Demonstrate Agile delivery across four sprints  

---

## 4. Functional Requirements (User Stories)

| ID | User story | Module |
|----|------------|--------|
| US-01 | As HR, I register foreign employees so that compliance records are centralised | IP2/IS3 |
| US-02 | As HR, I capture work-visa details so that expiry can be monitored | IP2 |
| US-03 | As a foreign national, I view my permits and QR code so that I know my status | IP2 |
| US-04 | As the system, I send expiry notifications so that renewals are not missed | IS3 |
| US-05 | As a verification officer, I verify permits so that invalid documents are detected | IP2/IS3 |
| US-06 | As an IoT device, I send scan events so that verification is logged in real time | IS3 |
| US-07 | As an admin, I manage organisations and users so that the platform is governed | IP2 |
| US-08 | As a manager, I view analytics so that I can make compliance decisions | IS3 |

---

## 5. Non-Functional Requirements

- **Security:** JWT authentication, RBAC, RLS, passport masking  
- **Performance:** Indexed database queries; API response under 2s for lookups  
- **Usability:** Mobile-first Ionic UI with clear status indicators  
- **Maintainability:** MVC backend, versioned SQL migrations  
- **Auditability:** Immutable verification logs  

---

## 6. System Design

### 6.1 Architecture

Three-tier: Ionic Angular → Node.js/Express REST API → Supabase PostgreSQL + Auth.

### 6.2 3NF ERD (IS3)

12 entities: organisations, profiles, foreign_nationals, permit_types, permits, renewal_update_requests, notifications, verification_logs, alerts, supporting_document_metadata, iot_devices, iot_scan_events.

See `docs/IS3-ERD.md`.

### 6.3 IoT Connectivity Map (IS3)

Simulated RFID/QR devices POST to `/api/iot/simulate` → verification engine → `iot_scan_events` + `verification_logs`.

See `docs/IS3-IOT-CONNECTIVITY-MAP.md`.

### 6.4 API Endpoint Plan (IP2)

40+ REST endpoints under `/api` — auth, CRUD, verification, IoT, analytics.  
See `docs/API-SPECIFICATION.md`.

---

## 7. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Ionic, Angular, TypeScript |
| Backend | Node.js, Express.js |
| Database | Supabase PostgreSQL |
| Auth | Supabase Authentication |
| IoT simulation | REST API + Cisco Packet Tracer map |
| Analytics | Power BI + SQL views |
| Testing | Postman |
| Version control | GitHub |

---

## 8. Product Backlog (Sprints 1–4)

### Sprint 1 (Week 2) — Backend & database
- Database migrations, RLS, seeds  
- Auth + organisation + user APIs  
- MVC project structure  

### Sprint 2 (Week 3) — API, IoT, integration
- Full CRUD on all entities  
- Verification engine  
- IoT simulate endpoint  
- Expiry cron job (BPMN automation)  
- Postman collection  
- HR frontend pages  

### Sprint 3 (Week 4) — Frontend, AI, analytics
- All role dashboards  
- SQL analytics views  
- Power BI connection  
- AI insights endpoint  
- BPMN/ERD/IoT documentation  

### Sprint 4 (Week 5) — Refinement
- Test plan execution  
- Final report and slides  
- UI polish  
- GitHub release tag  

---

## 9. Feasibility & Scope

**In scope:** Compliance monitoring, eight roles, simulated IoT, rule-based AI analytics, Power BI views.  
**Out of scope:** Official permit issuance, production SMS/email, live RFID hardware.

**Feasibility:** Stack aligns with programme modules; Supabase reduces infrastructure complexity; demo data supports live presentation.

---

## 10. Team & Responsibilities

| Member | Primary focus |
|--------|----------------|
| [Member 1] | Backend API, database |
| [Member 2] | Frontend, UX |
| [Member 3] | IS3 artefacts, Power BI |
| [Member 4] | IoT demo, Postman testing |
| [Member 5] | Documentation, presentation |

*Fill in names before submission.*

---

## 11. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Scope creep | Prioritise 4 core roles first |
| Supabase CLI issues on Windows | SQL Editor + setup-all.sql |
| Live demo failure | Rehearse; backup Postman + screenshots |

---

## 12. Conclusion

DigiPermit addresses a real compliance problem with an integrated full-stack solution satisfying DS3 Agile practice, IS3 digital firm pillars, and IP2 backend competencies. The To-Be BPMN model automates manual expiry tracking; IoT and analytics provide real-time and strategic value.

---

## References

- Phase 1 Planning: `docs/PHASE1-PLANNING-AND-DESIGN.md`  
- Capstone specification DSOF300/DVSF300  

---

**Appendices:** BPMN diagrams, ERD, IoT map — see `docs/CAPSTONE-DELIVERABLES-INDEX.md`
