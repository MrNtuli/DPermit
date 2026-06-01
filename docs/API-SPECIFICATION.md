# DigiPermit — REST API Specification (IP2)

**Base URL:** `http://localhost:3000/api`  
**Auth:** Bearer JWT in `Authorization` header  
**Response format:** `{ success, message, data }`

---

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register user + profile |
| POST | `/auth/login` | No | Login, returns session + profile |
| POST | `/auth/logout` | Yes | Logout |
| GET | `/auth/profile` | Yes | Current user profile |

---

## Organisations

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/organisations` | admin, manager | List all |
| GET | `/organisations/:id` | admin, org roles | Get one |
| POST | `/organisations` | admin | Create |
| PUT | `/organisations/:id` | admin | Update |
| DELETE | `/organisations/:id` | admin | Deactivate/archive |

---

## Users

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/users` | admin, hr | List profiles |
| POST | `/users` | admin | Create user |
| PUT | `/users/:id` | admin | Update role/status |

---

## Foreign Nationals

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/foreign-nationals` | hr, university, clinic, fn | List (scoped) |
| POST | `/foreign-nationals` | hr, university, clinic | Register |
| PUT | `/foreign-nationals/:id` | hr, university, clinic | Update |
| DELETE | `/foreign-nationals/:id` | hr, university, clinic | Archive |

---

## Permits

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/permits` | scoped by role | List permits |
| POST | `/permits` | hr, university, clinic | Capture record |
| PUT | `/permits/:id/validate` | admin, immigration | Validate |
| PUT | `/permits/:id/reject` | admin, immigration | Reject |
| PUT | `/permits/:id/revoke` | admin, immigration | Revoke |

---

## Verification

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/verify` | verification, hr | Manual lookup |
| POST | `/verify/qr` | verification, hr | QR verification |
| POST | `/verify/rfid` | verification | RFID verification |
| GET | `/verification-logs` | admin, verification | Audit trail |

---

## IoT

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/iot/simulate` | verification, admin | Simulate sensor scan |
| GET | `/iot/events` | admin, verification | Scan event log |
| GET | `/iot/devices` | admin, verification | Device registry |
| POST | `/iot/devices` | admin | Register device |

---

## Analytics & AI

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/analytics/summary` | all authenticated | Dashboard KPIs |
| GET | `/analytics/expiry` | admin, hr, manager | Expiring permits view |
| GET | `/analytics/ai-insights` | admin, manager, hr | AI executive summary |
| GET | `/analytics/suspicious-activity` | admin, immigration | Open suspicious alerts |

---

## Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | API status check |

Full Postman collection: `digipermit-backend/postman/DigiPermit-API.postman_collection.json`
