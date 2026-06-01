# Cisco Packet Tracer Lab Guide — DigiPermit IoT Simulation

**Time:** 30–45 minutes | **Deliverable:** Topology screenshot for report and slides

---

## Objective

Demonstrate network connectivity between a **simulated IoT RFID reader** and the **DigiPermit API server**, satisfying IS3 IoT pillar requirements.

---

## Topology to build

```
[Cloud/Internet]
       |
[Server-PT] 192.168.1.10  (DigiPermit Backend :3000)
       |
[Switch 2960]
    /         \
[MCU-PT]      [Laptop]
192.168.1.20  192.168.1.30
RFID Reader   Postman/HTTP client
```

---

## Step-by-step

### 1. Create network

1. Open Cisco Packet Tracer
2. Add: **Server**, **Switch-PT**, **Generic MCU** (or PC), **Laptop**
3. Connect with **Copper Straight-Through** cables
4. Add **Home Router** or connect Server to Cloud for internet (optional — for Supabase outbound from host PC, use laptop on real network for API calls)

### 2. Configure IPs

| Device | IP | Subnet |
|--------|-----|--------|
| Server | 192.168.1.10 | 255.255.255.0 |
| MCU (RFID) | 192.168.1.20 | 255.255.255.0 |
| Laptop | 192.168.1.30 | 255.255.255.0 |

### 3. Label devices

- Server desktop label: `DigiPermit API :3000`
- MCU label: `RFID Reader IOT-ACME-GATE-01`
- Laptop label: `Verification / Postman`

### 4. Simulation note (important for moderators)

Packet Tracer **cannot run Node.js** on Server-PT. For academic projects, the standard approach is:

1. **Topology screenshot** proves network design (IS3 map)
2. **Live HTTP POST** from your real laptop to `localhost:3000/api/iot/simulate` proves data integration

Say in presentation:

> "Packet Tracer models the LAN topology; the live demo sends HTTP from the officer workstation to our API, which writes to Supabase — demonstrating real-time IoT data ingestion."

### 5. Live demo command (on real laptop)

```powershell
# After login as verify@digipermit.demo — use Postman or:
$token = "YOUR_JWT_TOKEN"
$body = @{
  device_id = "d4000001-0000-4000-8000-000000000001"
  scan_type = "rfid"
  rfid_tag = "RFID-ACME-001"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/iot/simulate" -Method Post -Headers @{Authorization="Bearer $token"} -Body $body -ContentType "application/json"
```

### 6. Screenshot checklist

Save to `docs/images/` (create folder):

- [ ] `packet-tracer-topology.png` — full topology
- [ ] `iot-simulate-response.png` — Postman 200 response
- [ ] `supabase-iot-scan-events.png` — Table Editor showing new row

---

## Insert into report

Reference in Final Report Section 7.3 and presentation Slide 9.
