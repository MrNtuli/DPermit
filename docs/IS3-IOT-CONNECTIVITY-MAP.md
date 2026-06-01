# DigiPermit — IoT Connectivity Map (IS3)

**Module:** Information Systems 3 — IoT & Real-Time Data  
**Tool:** Cisco Packet Tracer (simulation) + DigiPermit REST API

---

## 1. System Overview

DigiPermit integrates **simulated IoT devices** (RFID readers and QR scanners) at employer/university checkpoints. Devices do not connect directly to the database; they send scan events to the **DigiPermit API**, which validates permits and stores events in **Supabase PostgreSQL**.

```
┌─────────────────┐     HTTP/REST      ┌──────────────────┐     Supabase Client    ┌─────────────────┐
│  IoT Layer      │ ─────────────────► │  Application     │ ─────────────────────► │  Data Layer     │
│  (Simulated)    │   POST /api/iot/   │  Node.js/Express │                        │  PostgreSQL     │
│                 │   simulate         │  Port 3000       │                        │  (Supabase)     │
└─────────────────┘                    └──────────────────┘                        └─────────────────┘
        │                                        │                                           │
        │                                        │                                           │
   RFID Reader                              Verification                               iot_scan_events
   QR Scanner                               Engine                                     verification_logs
   (Packet Tracer)                          Alerts                                     permits
```

---

## 2. Device Inventory (Seeded)

| Device ID | Name | Type | Location | Identifier |
|-----------|------|------|----------|------------|
| d400...001 | Acme Gate RFID Reader | rfid_reader | Acme employer gate | IOT-ACME-GATE-01 |
| d400...002 | Metro Campus QR Scanner | qr_scanner | University campus | IOT-METRO-QR-01 |
| d400...003 | Border Sim Checkpoint | rfid_reader | Verification simulation | IOT-BORDER-SIM-01 |

---

## 3. Cisco Packet Tracer Topology (Recommended Layout)

Build this topology in Packet Tracer for your presentation screenshot:

```
                    ┌─────────────────────────────────────────────┐
                    │              Cloud / Internet                │
                    └─────────────────────┬───────────────────────┘
                                          │
                    ┌─────────────────────▼───────────────────────┐
                    │           Server (DigiPermit Backend)        │
                    │           IP: 192.168.1.10                   │
                    │           Port: 3000                         │
                    │           Endpoint: /api/iot/simulate          │
                    └─────────────────────┬───────────────────────┘
                                          │ Ethernet
                    ┌─────────────────────▼───────────────────────┐
                    │              Switch (2960)                   │
                    └───┬─────────────────────────────┬───────────┘
                        │                             │
            ┌───────────▼──────────┐      ┌───────────▼──────────┐
            │  MCU/IoT Device      │      │  Verification PC       │
            │  (RFID Reader Sim)   │      │  (Officer workstation) │
            │  192.168.1.20        │      │  192.168.1.30          │
            └──────────────────────┘      └────────────────────────┘
```

### Packet Tracer steps (summary)

1. Add **Server**, **Switch**, **Home Gateway** or **Cloud**, and a **MCU** or generic end device.
2. Assign IPs on `192.168.1.0/24`.
3. Configure server with static IP `192.168.1.10`.
4. Use a **Laptop** on the network to represent HTTP client (Postman / browser).
5. Label the MCU as **"RFID Reader — IOT-ACME-GATE-01"**.
6. Screenshot topology for proposal/report.

> **Note:** Packet Tracer cannot run Node.js. The "sensor" is **simulated** by sending HTTP POST from a laptop/PC on the same network, which matches academic IoT simulation requirements.

---

## 4. Data Flow (Scan Event)

| Step | Action | Protocol | Data |
|------|--------|----------|------|
| 1 | RFID tag read | Simulated | `RFID-ACME-001` |
| 2 | Device POST to API | HTTP/JSON | `{ device_id, scan_type: "rfid", rfid_tag }` |
| 3 | API lookup permit | SQL | `SELECT * FROM permits WHERE rfid_tag = ?` |
| 4 | Verification engine | Business logic | valid / expired / revoked / suspicious |
| 5 | Store scan event | SQL INSERT | `iot_scan_events` |
| 6 | Store verification log | SQL INSERT | `verification_logs` |
| 7 | Create alert if needed | SQL INSERT | `alerts` |
| 8 | Return JSON result | HTTP 200 | masked passport, result, timestamp |

---

## 5. Live Demo Commands

### RFID simulation (Postman or curl)

```http
POST http://localhost:3000/api/iot/simulate
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "device_id": "d4000001-0000-4000-8000-000000000001",
  "scan_type": "rfid",
  "rfid_tag": "RFID-ACME-001"
}
```

### Expected database records after scan

- 1 row in `iot_scan_events`
- 1 row in `verification_logs`
- Optional row in `alerts` (if expired/revoked/suspicious)

---

## 6. Connectivity to Supabase

The backend uses the Supabase service role connection (HTTPS outbound from server). IoT devices only need network access to the API — they never hold database credentials.

```
IoT Device → LAN → DigiPermit API → Internet → Supabase PostgreSQL (db.uafgtzemigqphejuscsu.supabase.co:5432)
```

---

## Important limitation

DigiPermit does not replace official immigration systems. IoT verification confirms **compliance records** only.
