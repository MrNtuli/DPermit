# DigiPermit — Final Project Report

**Module Integration:** Development Software 3 (DS3) × Information Systems 3 (IS3) × Internet Programming 2 (IP2)  
**Project Title:** DigiPermit: A Multi-User Foreign-National Visa and Permit Compliance Monitoring System  
**Duration:** 6 Weeks (4 Sprints)  
**Methodology:** Agile (Scrum)

---

## Declaration

This report describes the design, implementation, and evaluation of DigiPermit. AI-assisted tools (including Cursor/ChatGPT) were used for code generation and documentation drafting. All team members must be able to explain design decisions and demonstrate understanding of the implemented system during the external moderation.

---

## 1. Problem Statement & Strategic Context

Foreign nationals holding work visas, study visas, and other immigration-related documents must comply with expiry dates and renewal conditions. Employers, universities, and clinics often track these records manually using spreadsheets and email, leading to:

- Missed expiry dates and delayed renewals
- No real-time verification at checkpoints
- No audit trail for compliance decisions
- Unauthorised access to sensitive records

**Strategic significance:** Non-compliance creates legal, operational, and reputational risk for organisations employing or enrolling foreign nationals.

> **Limitation:** DigiPermit is a compliance-monitoring platform. It does not issue official visas or replace the Department of Home Affairs or any official immigration authority.

---

## 2. Target Users & Stakeholders

| Stakeholder | Role in system |
|-------------|----------------|
| System Administrator | Platform governance |
| Employer HR Officer | Employee work-visa compliance |
| University International Office | Student study-visa monitoring |
| Clinic Administrator | Patient/employee document records |
| Foreign National | Self-service permit visibility |
| Verification Officer | Checkpoint verification |
| Immigration Officer (simulated) | Record validation |
| Manager/Auditor | Read-only analytics |

---

## 3. System Objectives

1. Centralise permit compliance records in a secure multi-tenant database
2. Automate expiry monitoring and notifications
3. Provide multi-channel verification (manual, QR, RFID simulation)
4. Detect suspicious verification activity using rule-based analytics
5. Deliver role-specific dashboards and Power BI executive reporting
6. Demonstrate full-stack integration across IS3, IP2, and DS3 outcomes

---

## 4. Functional Requirements (Summary)

- Authentication and role-based access control (8 roles)
- CRUD for organisations, users, foreign nationals, permits, permit types
- Verification with ten result states and audit logging
- Automated daily expiry job with notifications at 90→0 days
- IoT scan simulation feeding database in real time
- Renewal/update request workflow
- Analytics API and SQL views for Power BI
- AI-assisted executive insight summaries

Full requirements: see `docs/PHASE1-PLANNING-AND-DESIGN.md`.

---

## 5. Non-Functional Requirements

| Category | Implementation |
|----------|----------------|
| Security | JWT auth, RBAC middleware, RLS, passport masking, `.env` secrets |
| Performance | Indexed queries on permit_number, expiry_date, organisation_id |
| Usability | Ionic mobile-first UI, loading states, status badges |
| Maintainability | MVC backend, versioned SQL migrations |
| Auditability | Immutable verification logs, soft archival |

---

## 6. System Design

### 6.1 Architecture (Three-tier)

```
Presentation: Ionic Angular (TypeScript)
Business Logic: Node.js + Express (REST API)
Data: Supabase PostgreSQL + Supabase Auth
```

### 6.2 Design artefacts (IS3)

| Artefact | Location |
|----------|----------|
| BPMN As-Is / To-Be | `docs/IS3-BPMN-PROCESS-MODELS.md` |
| 3NF ERD | `docs/IS3-ERD.md` |
| IoT Connectivity Map | `docs/IS3-IOT-CONNECTIVITY-MAP.md` |
| AI Workflow | `docs/IS3-AI-WORKFLOW.md` |

### 6.3 Database

- 12 normalised tables with foreign keys and check constraints
- 7 analytics views for Power BI
- Row Level Security for organisation isolation
- Live IoT data in `iot_scan_events`

---

## 7. Implementation

### 7.1 Backend (IP2)

- **Stack:** Node.js, Express.js, `@supabase/supabase-js`
- **Pattern:** Routes → Controllers → Services → Supabase
- **Endpoints:** 40+ REST routes documented in Postman
- **Validation:** express-validator pattern, global error handler
- **Jobs:** `expiryCheckJob.js` (node-cron, daily 06:00 UTC)

### 7.2 Frontend (IP2)

- **Stack:** Ionic 8, Angular 20, TypeScript
- **Features:** Route guards, auth interceptor, role-based sidebar
- **Pages:** 8 role modules with dashboards and CRUD forms

### 7.3 IoT Integration (IS3)

Simulated RFID/QR devices POST to `/api/iot/simulate`. Backend validates permit, stores `iot_scan_events` and `verification_logs`, creates alerts when required. Cisco Packet Tracer topology documented for presentation.

### 7.4 AI & Analytics (IS3)

- Rule-based suspicious-activity detection in verification flow
- `GET /api/analytics/ai-insights` — executive summary generation
- Power BI connects to Supabase views (`vw_expiring_permits`, etc.)

---

## 8. Agile Process (DS3)

| Sprint | Week | Deliverable |
|--------|------|-------------|
| Sprint 1 | 2 | Backend + database foundation |
| Sprint 2 | 3 | Full API, IoT, HR frontend |
| Sprint 3 | 4 | All roles UI, analytics, AI |
| Sprint 4 | 5 | Testing, report, presentation |

Sprint reviews: `docs/sprints/SPRINT-*-REVIEW.md`  
Product backlog: `docs/PHASE1-PLANNING-AND-DESIGN.md` Section 13

---

## 9. Testing

Test plan: `docs/TEST-PLAN.md`  
Postman collection: `digipermit-backend/postman/DigiPermit-API.postman_collection.json`

**Sample results:**
- Authentication: PASS
- CRUD operations: PASS
- Verification (valid/expired/revoked): PASS
- IoT simulation: PASS
- Role isolation: PASS

---

## 10. Demonstration Scenario

See `docs/DEMO-SCRIPT.md` for the full 23-step flow.

**Summary:** HR registers employee → captures permit → employee views QR → verification officer scans → admin views alerts → Power BI dashboard.

---

## 11. Challenges & Lessons Learned

| Challenge | Resolution |
|-----------|------------|
| Supabase CLI unavailable on Windows | Used SQL Editor + combined `setup-all.sql` |
| CORS port mismatch (4200 vs 8100) | Multi-origin CORS configuration |
| Academic scope vs feature breadth | Prioritised 4 core roles first, extended to 8 |
| IoT hardware unavailable | HTTP simulation via API + Packet Tracer map |

---

## 12. Conclusion

DigiPermit successfully integrates backend development (IP2), digital firm architecture pillars (IS3), and Agile software engineering practices (DS3) into a single working system. The platform automates the manual expiry-tracking bottleneck identified in the As-Is BPMN model, feeds simulated IoT data into a 3NF database, and supports executive decision-making through Power BI and AI insight summaries.

---

## References

- Ionic Framework Documentation — https://ionicframework.com/docs
- Supabase Documentation — https://supabase.com/docs
- OMG BPMN 2.0 Specification
- Express.js Guide — https://expressjs.com
- Microsoft Power BI Documentation

---

## Appendices

| Appendix | File |
|----------|------|
| A. API Specification | `docs/API-SPECIFICATION.md` |
| B. Demo Script | `docs/DEMO-SCRIPT.md` |
| C. Power BI Setup | `docs/POWER-BI-SETUP.md` |
| D. Test Plan | `docs/TEST-PLAN.md` |
| E. Presentation Slides | `docs/PRESENTATION-SLIDE-DECK.md` |

**Report length:** ~12 pages (when exported to PDF from this document)
