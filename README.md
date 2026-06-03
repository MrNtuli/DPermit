# DigiPermit

**DigiPermit: A Multi-User Foreign-National Visa and Permit Compliance Monitoring System**

A full-stack academic project for monitoring, managing, and verifying immigration-related compliance records for foreign nationals.

## Important Limitation

> DigiPermit is a compliance-monitoring and verification platform. It does not issue official visas or immigration permits, and it does not replace the Department of Home Affairs or any official immigration authority. It helps foreign nationals and authorised organisations monitor document validity, receive expiry reminders, verify records, and maintain compliance logs.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Ionic, Angular, TypeScript, SCSS |
| Backend | Node.js, Express.js, REST API |
| Database | Supabase PostgreSQL |
| Auth | Supabase Authentication + JWT |
| Analytics | SQL Views + Power BI |
| Testing | Postman |

## Project Structure

```
DPermit/
├── docs/                          Planning, demo script, Power BI guide
├── digipermit-backend/            Node.js Express API
│   ├── src/                       Controllers, services, routes, middleware
│   ├── database/                  Migrations, seeds, views
│   └── postman/                   API collection
└── digipermit-frontend/           Ionic Angular app
    └── src/app/                   Pages, services, guards, components
```

## Live deployment (GitHub + Render)

Hosted demo (after setup):

- **App:** https://mrntuli.github.io/DPermit/
- **Repo:** https://github.com/MrNtuli/DPermit

Full steps: **[docs/DEPLOY.md](docs/DEPLOY.md)** and **[docs/GITHUB-SETUP.md](docs/GITHUB-SETUP.md)**.

---

## Quick Start

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run all SQL files in order:
   - `digipermit-backend/database/migrations/001` → `013`
   - `digipermit-backend/database/views/analytics_views.sql`
   - `digipermit-backend/database/seeds/001` → `005`

### 2. Backend

```bash
cd digipermit-backend
cp .env.example .env
# Edit .env with your Supabase URL and keys
npm install
npm run seed
npm run dev
```

### 3. Frontend

```bash
cd digipermit-frontend
npm install
npm start
```

Open `http://localhost:8100/welcome`

### 4. Demo

See [docs/DEMO-SCRIPT.md](docs/DEMO-SCRIPT.md) for the full 23-step demonstration flow.

**Demo password:** `Demo@12345`

## User Roles

- System Administrator
- Foreign National
- Employer HR / Compliance Officer
- University International-Office Officer
- Clinic / Hospital Administrator
- Verification Officer
- Immigration / Senior Compliance Officer (simulated)
- Manager / Auditor

## Features

- Role-based access control (frontend guards + backend middleware + RLS)
- Permit capture and lifecycle management
- Multi-channel verification (manual, QR, RFID simulation)
- Automated expiry notifications (daily cron job)
- Suspicious-activity detection
- Audit logs and alerts
- IoT scan simulation
- Analytics views for Power BI
- 8 role-specific dashboards

## Documentation

- **[Capstone Deliverables Index](docs/CAPSTONE-DELIVERABLES-INDEX.md)** — all IS3/IP2/DS3 artefacts
- [Phase 1 Planning](docs/PHASE1-PLANNING-AND-DESIGN.md)
- [Final Project Report](docs/FINAL-PROJECT-REPORT.md)
- [Presentation Slide Deck](docs/PRESENTATION-SLIDE-DECK.md)
- [Demo Script](docs/DEMO-SCRIPT.md)
- [Test Plan](docs/TEST-PLAN.md)
- [BPMN Process Models](docs/IS3-BPMN-PROCESS-MODELS.md)
- [IoT Connectivity Map](docs/IS3-IOT-CONNECTIVITY-MAP.md)
- [AI Workflow](docs/IS3-AI-WORKFLOW.md)
- [Power BI Setup](docs/POWER-BI-SETUP.md)
- [GitHub Setup](docs/GITHUB-SETUP.md)
- [Backend README](digipermit-backend/README.md)
- [Frontend README](digipermit-frontend/README.md)

## API Endpoints

All endpoints are prefixed with `/api`. See Postman collection for full list:

- Auth: `/auth/login`, `/auth/profile`
- CRUD: `/organisations`, `/users`, `/foreign-nationals`, `/permits`, `/permit-types`
- Verification: `/verify`, `/verify/qr`, `/verify/rfid`
- Analytics: `/analytics/summary`, `/analytics/expiry`
- IoT: `/iot/simulate`, `/iot/devices`, `/iot/events`

## License

Academic demonstration project.
