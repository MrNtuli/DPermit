# Sprint 2 — API Expansion, IoT & Integration

**Duration:** Week 3 | **Sprint Goal:** Full CRUD, IoT simulation, API docs, basic frontend

## Sprint backlog (completed)

| ID | Task | Module | Status |
|----|------|--------|--------|
| S2-1 | Full permit CRUD + validate/reject/revoke | IP2 | Done |
| S2-2 | Verification engine (manual, QR, RFID) | IP2 | Done |
| S2-3 | IoT simulate endpoint + scan events | IS3 | Done |
| S2-4 | Postman collection | IP2 | Done |
| S2-5 | Expiry cron job (BPMN bottleneck automation) | IS3 | Done |
| S2-6 | Alerts and notifications services | IS3 | Done |
| S2-7 | Ionic Angular app scaffold + auth pages | IP2 | Done |
| S2-8 | Employer HR pages (employees, permits) | IP2 | Done |

## Increment delivered

- Complete REST API (40+ endpoints)
- IoT data flowing into `iot_scan_events` and `verification_logs`
- Business process automation: automated expiry notifications
- Frontend login and HR workflow consuming API

## Sprint review demo

1. HR captures work visa via API/UI
2. POST `/api/iot/simulate` with RFID tag
3. Postman login + verify permit

## Retrospective

| Went well | Improve next sprint |
|-----------|---------------------|
| End-to-end verification logic | CORS config for dev ports |
| Suspicious-activity rules | More frontend form validation |
