# Sprint 1 — Backend & Database Foundation

**Duration:** Week 2 | **Sprint Goal:** Working backend with structured database and initial CRUD

## Sprint backlog (completed)

| ID | Task | Module | Status |
|----|------|--------|--------|
| S1-1 | Create Supabase project and configure environment | IS3 | Done |
| S1-2 | Write SQL migrations (12 tables, FKs, constraints) | IS3 | Done |
| S1-3 | Implement RLS policies | IS3 | Done |
| S1-4 | Seed permit types, organisations, demo data | IS3 | Done |
| S1-5 | Initialise Express project (MVC structure) | IP2 | Done |
| S1-6 | Auth endpoints (login, profile) | IP2 | Done |
| S1-7 | Organisation + user CRUD endpoints | IP2 | Done |
| S1-8 | Git repository initialised | DS3 | Done |

## Increment delivered

- 3NF PostgreSQL schema on Supabase
- REST API with auth, organisations, users, foreign nationals, permit types
- Controller → service → route separation
- `.env` configuration and health check endpoint

## Sprint review notes

- Database migrations run successfully via `setup-all.sql`
- Demo users seeded via `npm run seed`
- **Next sprint:** Full CRUD, IoT, Postman, frontend start

## Retrospective

| Went well | Improve next sprint |
|-----------|---------------------|
| Clear folder structure | Add automated migration runner |
| Supabase RLS in place | Expand unit tests |
