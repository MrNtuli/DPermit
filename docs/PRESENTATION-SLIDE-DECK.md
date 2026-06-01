# DigiPermit — Final Presentation Slide Deck

**Duration:** 30–40 minutes | **Audience:** Lecturer + External Moderator  
**Format:** Live demo compulsory — assign slides to team members

---

## Slide 1 — Title
**DigiPermit: Foreign-National Visa & Permit Compliance Monitoring**  
DSOF300/DVSF300 Major Project  
Team members: [Names]  
Date: [Date]

---

## Slide 2 — Problem Overview
- Foreign nationals must maintain valid visas/permits
- Manual tracking → missed renewals, compliance risk
- No verification audit trail at checkpoints
- **Limitation:** We monitor compliance — we do not issue official permits

---

## Slide 3 — Strategic Context (IS3)
- Real-world problem for employers, universities, clinics
- Aligns with digital firm: automation, IoT, data integrity, analytics
- One integrated system — not three separate projects

---

## Slide 4 — BPMN As-Is (IS3)
- Show diagram from `IS3-BPMN-PROCESS-MODELS.md`
- Highlight bottleneck: **manual expiry checking in spreadsheets**

---

## Slide 5 — BPMN To-Be (IS3)
- DigiPermit automated flow
- Daily expiry job + notifications + verification logs
- **Bottleneck automated:** expiry monitoring

---

## Slide 6 — Target Users
- 8 roles: Admin, HR, FN, University, Clinic, Verification, Immigration, Manager
- Role-based access — each sees only authorised data

---

## Slide 7 — System Architecture
Three-tier diagram:
- Ionic Angular → Express API → Supabase PostgreSQL
- Supabase Auth for identity

---

## Slide 8 — Database & 3NF ERD (IS3)
- 12 tables, FKs, unique constraints
- Show ERD from `IS3-ERD.md`
- Live IoT data in `iot_scan_events`

---

## Slide 9 — IoT Connectivity Map (IS3)
- Packet Tracer topology screenshot
- Sensor → API → Database flow
- Device: IOT-ACME-GATE-01

---

## Slide 10 — API Design (IP2)
- RESTful, JSON, JWT auth
- MVC: routes → controllers → services
- Postman collection demo (live)

---

## Slide 11 — LIVE DEMO Part 1
**HR Officer** (`hr@acmeglobal.demo`)
1. Dashboard
2. Register employee
3. Capture work visa

---

## Slide 12 — LIVE DEMO Part 2
**Foreign National** (`james.okonkwo@demo.mail`)
1. My permits
2. QR code
3. Notifications

---

## Slide 13 — LIVE DEMO Part 3
**Verification Officer** (`verify@digipermit.demo`)
1. Manual: WP-2024-ACME-001 → Valid
2. WP-2023-ACME-003 → Expired
3. **IoT RFID simulation** (live)

---

## Slide 14 — LIVE DEMO Part 4
**System Admin** — alerts + verification logs  
**Immigration Officer** — validate pending permit

---

## Slide 15 — AI Workflow (IS3)
- Rule-based detection rules (R-EXP, R-SCAN, R-QR, etc.)
- `GET /api/analytics/ai-insights` — live call
- Show insight summary on screen

---

## Slide 16 — Power BI Dashboard (IS3)
- Live dashboard connected to Supabase views
- Permit status, expiry forecast, verification trends
- *Screenshot if live connection fails — but aim for live*

---

## Slide 17 — Business Process Automation
- Expiry cron job schedule
- Notification thresholds: 90, 60, 30, 14, 7, 1, 0 days
- Maps directly to To-Be BPMN

---

## Slide 18 — Security & Data Integrity
- RBAC frontend + backend + RLS
- Passport masking in verification
- Immutable verification logs

---

## Slide 19 — Agile Process (DS3)
- 4 sprints over 6 weeks
- Sprint goals and increments table
- GitHub commit history screenshot

---

## Slide 20 — Testing (IP2)
- Postman tests
- Test plan summary
- Role access matrix

---

## Slide 21 — Challenges & Lessons
- Windows/Supabase CLI workaround
- Scope prioritisation
- Integration over complexity

---

## Slide 22 — Conclusion
- All three module outcomes demonstrated
- System runs end-to-end live
- Future: email/SMS, real RFID hardware, LLM insights

---

## Slide 23 — Q&A
**Thank you**  
Demo credentials on hand for moderator if needed.

---

## Speaker allocation (example 5-member team)

| Time | Speaker | Content |
|------|---------|---------|
| 0–5 min | Member 1 | Slides 1–5 Problem & BPMN |
| 5–10 min | Member 2 | Slides 6–10 Architecture & API |
| 10–20 min | Member 3 | Slides 11–14 Live demo |
| 20–28 min | Member 4 | Slides 15–18 AI, Power BI, security |
| 28–35 min | Member 5 | Slides 19–22 Agile, testing, conclusion |
| 35–40 min | All | Q&A |
