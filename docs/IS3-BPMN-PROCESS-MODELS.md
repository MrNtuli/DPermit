# DigiPermit — BPMN 2.0 Process Models (IS3)

**Project:** DigiPermit — Foreign-National Visa and Permit Compliance Monitoring  
**Module:** Information Systems 3 (IS3) — Business Process Automation  
**Bottleneck automated:** Manual expiry tracking and missed renewal notifications

---

## 1. As-Is Process (Manual Workflow)

**Process name:** Manual Foreign-Employee Work-Visa Compliance Tracking  
**Primary actor:** Employer HR / Compliance Officer  
**Pain points:** Spreadsheets, missed expiry dates, no verification audit trail, delayed renewal action

```mermaid
flowchart TD
    Start([Foreign employee hired]) --> A[HR receives paper/electronic visa copy]
    A --> B[HR enters details in spreadsheet]
    B --> C[HR manually checks expiry dates periodically]
    C --> D{Expiry within 30 days?}
    D -->|No| C
    D -->|Yes| E[HR sends informal email reminder]
    E --> F{Employee renews in time?}
    F -->|Yes| G[HR updates spreadsheet manually]
    F -->|No| H[Expired visa may go unnoticed]
    G --> C
    H --> I[Compliance risk / continued employment without valid record]
    I --> End([Process ends — audit failure risk])

    style H fill:#ffcdd2
    style I fill:#ffcdd2
```

### As-Is bottlenecks identified

| # | Bottleneck | Impact |
|---|------------|--------|
| B1 | Manual spreadsheet expiry checks | Dates overlooked; no automated reminders |
| B2 | No central verification at gate/checkpoint | Security cannot confirm permit validity in real time |
| B3 | No audit log of verification attempts | Cannot investigate suspicious usage |
| B4 | Disconnected employee self-service | Foreign nationals unaware of expiry timeline |

**Selected bottleneck for automation (To-Be):** **B1 — Manual expiry monitoring**

---

## 2. To-Be Process (DigiPermit Automated Workflow)

**Process name:** Digital Permit Compliance Monitoring via DigiPermit  
**Automated elements:** Scheduled expiry job, in-app notifications, verification API, audit logs, alerts

```mermaid
flowchart TD
    Start([Foreign employee hired]) --> A[HR logs into DigiPermit]
    A --> B[HR registers foreign national record]
    B --> C[HR captures work-visa compliance record]
    C --> D[System generates QR code and status: pending verification]
    D --> E[Immigration Officer validates record]
    E --> F{Validated?}
    F -->|No| G[Status: rejected — HR notified]
    F -->|Yes| H[Status: active — employee notified]
    H --> I[[Automated: Daily expiry check job]]
    I --> J{Days until expiry?}
    J -->|90/60/30/14/7/1/0| K[System creates notifications for employee and HR]
    J -->|Expired| L[System creates alert — escalation]
    K --> M[Employee views dashboard and QR code]
    L --> N[Verification Officer scans at checkpoint]
    M --> N
    N --> O[DigiPermit verifies status and logs attempt]
    O --> P{Result valid?}
    P -->|Yes| Q[Access granted — log stored]
    P -->|No| R[Alert created — compliance review]
    Q --> End([Ongoing monitoring])
    R --> End
    G --> End

    style I fill:#c8e6c9
    style K fill:#c8e6c9
    style L fill:#fff9c4
```

### Automation mapping

| As-Is bottleneck | To-Be automation | DigiPermit component |
|------------------|------------------|----------------------|
| Manual expiry checks | Daily cron job at 06:00 UTC | `expiryCheckJob.js` |
| No employee visibility | Foreign National dashboard + notifications | Ionic FN pages + `notifications` table |
| No verification audit | Verification logs on every scan | `verificationService.js` + `verification_logs` |
| Suspicious usage undetected | Rule-based activity detection | `suspiciousActivityService` rules in verification flow |

---

## 3. Secondary To-Be Process: IoT Verification at Checkpoint

```mermaid
sequenceDiagram
    participant Sensor as IoT Device (RFID/QR)
    participant API as DigiPermit API
    participant DB as Supabase PostgreSQL
    participant Officer as Verification Officer

    Sensor->>API: POST /api/iot/simulate (device_id, rfid_tag)
    API->>DB: Lookup permit by RFID tag
    DB-->>API: Permit record + status
    API->>API: Compute result (valid/expired/revoked/suspicious)
    API->>DB: Insert iot_scan_events
    API->>DB: Insert verification_logs
    API->>DB: Create alert if required
    API-->>Officer: Verification result (masked passport)
```

---

## Important limitation

DigiPermit is a compliance-monitoring platform. It does not issue official visas or replace government immigration authorities.
