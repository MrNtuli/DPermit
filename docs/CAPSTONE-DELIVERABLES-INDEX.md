# DigiPermit — Capstone Deliverables Index

All documentation required for **DS3 × IS3 × IP2** Major Project.

## IS3 (Mrs Khumbu Ngcobo)

| Deliverable | File |
|-------------|------|
| BPMN 2.0 As-Is & To-Be | [IS3-BPMN-PROCESS-MODELS.md](./IS3-BPMN-PROCESS-MODELS.md) |
| 3NF ERD | [IS3-ERD.md](./IS3-ERD.md) |
| IoT Connectivity Map | [IS3-IOT-CONNECTIVITY-MAP.md](./IS3-IOT-CONNECTIVITY-MAP.md) |
| AI Workflow Diagram | [IS3-AI-WORKFLOW.md](./IS3-AI-WORKFLOW.md) |
| Power BI Setup | [POWER-BI-SETUP.md](./POWER-BI-SETUP.md) |

## IP2 (Mr Xolisa Piyose)

| Deliverable | File |
|-------------|------|
| API Specification | [API-SPECIFICATION.md](./API-SPECIFICATION.md) |
| Postman Collection | `../digipermit-backend/postman/DigiPermit-API.postman_collection.json` |
| Test Plan | [TEST-PLAN.md](./TEST-PLAN.md) |

## DS3 (Agile / Process)

| Deliverable | File |
|-------------|------|
| Phase 1 Planning | [PHASE1-PLANNING-AND-DESIGN.md](./PHASE1-PLANNING-AND-DESIGN.md) |
| Sprint 1 Review | [sprints/SPRINT-1-REVIEW.md](./sprints/SPRINT-1-REVIEW.md) |
| Sprint 2 Review | [sprints/SPRINT-2-REVIEW.md](./sprints/SPRINT-2-REVIEW.md) |
| Sprint 3 Review | [sprints/SPRINT-3-REVIEW.md](./sprints/SPRINT-3-REVIEW.md) |
| Sprint 4 Review | [sprints/SPRINT-4-REVIEW.md](./sprints/SPRINT-4-REVIEW.md) |
| GitHub Setup | [GITHUB-SETUP.md](./GITHUB-SETUP.md) |
| Academic Integrity | [ACADEMIC-INTEGRITY-DECLARATION.md](./ACADEMIC-INTEGRITY-DECLARATION.md) |

## Final submission

| Deliverable | Markdown | PDF |
|-------------|----------|-----|
| **System description (Major Project)** | [MAJOR-PROJECT-SYSTEM-DESCRIPTION.md](./MAJOR-PROJECT-SYSTEM-DESCRIPTION.md) | [PDF](./pdf/MAJOR-PROJECT-SYSTEM-DESCRIPTION.pdf) |
| Final Report (10–15 pages) | [FINAL-PROJECT-REPORT.md](./FINAL-PROJECT-REPORT.md) | [PDF](./pdf/FINAL-PROJECT-REPORT.pdf) |
| Live Demo Script | [DEMO-SCRIPT.md](./DEMO-SCRIPT.md) | [PDF](./pdf/DEMO-SCRIPT.pdf) |
| **Demo registration cheat sheet** | [DEMO-REGISTRATION-QUICK-REFERENCE.md](./DEMO-REGISTRATION-QUICK-REFERENCE.md) | [PDF](./pdf/DEMO-REGISTRATION-QUICK-REFERENCE.pdf) |
| **User roles guide (group)** | — | [PDF](./pdf/DIGIPERMIT-USER-ROLES-GUIDE.pdf) — regenerate: `python scripts/generate-group-roles-pdf.py` |
| Phase 1 Planning | [PHASE1-PLANNING-AND-DESIGN.md](./PHASE1-PLANNING-AND-DESIGN.md) | [PDF](./pdf/PHASE1-PLANNING-AND-DESIGN.pdf) |
| Presentation Slides | [PRESENTATION-SLIDE-DECK.md](./PRESENTATION-SLIDE-DECK.md) | [PowerPoint](./presentation/DigiPermit-Presentation.pptx) — `python scripts/generate-presentation-pptx.py` |

*Regenerate all four PDFs:* `python scripts/generate-submission-pdfs.py`

## Additional resources (new)

| Resource | File |
|----------|------|
| **Team role assignments & test plan** | [GROUP-TEST-ASSIGNMENTS.md](./GROUP-TEST-ASSIGNMENTS.md) |
| Project Proposal (Week 1) | [PROJECT-PROPOSAL.md](./PROJECT-PROPOSAL.md) |
| **Power BI live Supabase** | [power-bi/POWER-BI-LIVE-SUPABASE.md](./power-bi/POWER-BI-LIVE-SUPABASE.md) |
| Power BI index | [power-bi/README.md](./power-bi/README.md) |
| Power BI build guide | [power-bi/POWER-BI-DASHBOARD-BUILD-GUIDE.md](./power-bi/POWER-BI-DASHBOARD-BUILD-GUIDE.md) |
| Power BI CSV export | `npm run export:powerbi` in `digipermit-backend` |
| Theme + DAX | [power-bi/DigiPermit-Theme.json](./power-bi/DigiPermit-Theme.json), [DigiPermit-Measures.dax](./power-bi/DigiPermit-Measures.dax) |
| Packet Tracer lab | [PACKET-TRACER-LAB-GUIDE.md](./PACKET-TRACER-LAB-GUIDE.md) |
| Jira CSV import | [jira/JIRA-BACKLOG-IMPORT.csv](./jira/JIRA-BACKLOG-IMPORT.csv) |
| Browser presentation backup | [presentation.html](./presentation.html) |
| System verify script | `scripts/verify-system.ps1` |

## Quick checklist before Week 6 demo

- [ ] Power BI dashboard built — live Supabase: `power-bi/POWER-BI-LIVE-SUPABASE.md`
- [ ] Cisco Packet Tracer topology screenshot — follow `PACKET-TRACER-LAB-GUIDE.md`
- [ ] GitHub repository pushed — follow `GITHUB-SETUP.md`
- [ ] Run `scripts/verify-system.ps1` (backend must be running)
- [ ] All team members assigned presentation sections
- [ ] Academic integrity form completed with team names
- [ ] Backend + frontend running without errors
