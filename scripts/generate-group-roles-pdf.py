"""Generate DigiPermit User Roles Guide PDF for group members."""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs" / "pdf" / "DIGIPERMIT-USER-ROLES-GUIDE.pdf"

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DigiPermit — User Roles Guide</title>
  <style>
    @page { margin: 0; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", Calibri, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.5;
      color: #334155;
      margin: 0;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 16mm 14mm 18mm;
      page-break-after: always;
      position: relative;
    }
    .page:last-child { page-break-after: auto; }

    /* Cover */
    .cover {
      background: linear-gradient(145deg, #0f3d2e 0%, #1f7a5a 55%, #2a9d72 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 22mm 18mm;
    }
    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 12px;
      padding: 10px 16px;
      width: fit-content;
      margin-bottom: 24px;
    }
    .cover h1 {
      font-size: 28pt;
      font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.02em;
    }
    .cover .tagline {
      font-size: 13pt;
      opacity: 0.92;
      margin: 0 0 28px;
      max-width: 140mm;
    }
    .cover-meta {
      font-size: 10pt;
      opacity: 0.85;
      border-top: 1px solid rgba(255,255,255,0.3);
      padding-top: 16px;
      margin-top: auto;
    }

    /* Content pages */
    .page-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 3px solid #1f7a5a;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .page-header h2 {
      margin: 0;
      font-size: 16pt;
      color: #0f3d2e;
      flex: 1;
    }
    .page-num {
      font-size: 9pt;
      color: #64748b;
    }

    .purpose-box {
      background: #eaf6f0;
      border-left: 4px solid #1f7a5a;
      border-radius: 0 10px 10px 0;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .purpose-box strong { color: #0f3d2e; }
    .disclaimer {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 9.5pt;
      margin-bottom: 16px;
      color: #92400e;
    }

    .flow {
      display: flex;
      align-items: stretch;
      gap: 6px;
      margin: 14px 0 18px;
      flex-wrap: wrap;
    }
    .flow-step {
      flex: 1;
      min-width: 28mm;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 6px;
      text-align: center;
      font-size: 8.5pt;
    }
    .flow-step-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 6px;
    }
    .flow-step strong { display: block; color: #0f3d2e; font-size: 8pt; margin-bottom: 2px; }
    .flow-step span.step-desc { font-size: 7.5pt; color: #64748b; display: block; line-height: 1.3; }
    .flow-arrow {
      color: #1f7a5a;
      align-self: center;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .demo-box h3 {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .demo-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .disclaimer-title {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .disclaimer-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: #f59e0b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .role-card {
      display: flex;
      gap: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 10px;
      page-break-inside: avoid;
      background: #fff;
    }
    .role-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .role-card h3 {
      margin: 0 0 4px;
      font-size: 11.5pt;
      color: #0f3d2e;
    }
    .role-tag {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }
    .role-card p { margin: 0 0 6px; font-size: 9.5pt; }
    .role-card ul {
      margin: 0;
      padding-left: 16px;
      font-size: 9pt;
      color: #475569;
    }
    .role-card li { margin-bottom: 2px; }
    .contrib {
      font-size: 8.5pt;
      color: #1f7a5a;
      font-weight: 600;
      margin-top: 6px !important;
    }

    /* Role accent colours */
    .accent-admin .role-icon-wrap { background: #0f3d2e; }
    .accent-admin .role-tag { background: #eaf6f0; color: #0f3d2e; }
    .accent-hr .role-icon-wrap { background: #1f7a5a; }
    .accent-hr .role-tag { background: #eaf6f0; color: #1f7a5a; }
    .accent-uni .role-icon-wrap { background: #2a9d72; }
    .accent-uni .role-tag { background: #d4ebe0; color: #0f3d2e; }
    .accent-clinic .role-icon-wrap { background: #0d9488; }
    .accent-clinic .role-tag { background: #ccfbf1; color: #0f766e; }
    .accent-fn .role-icon-wrap { background: #3b82f6; }
    .accent-fn .role-tag { background: #dbeafe; color: #1d4ed8; }
    .accent-verify .role-icon-wrap { background: #f59e0b; }
    .accent-verify .role-tag { background: #fef3c7; color: #b45309; }
    .accent-imm .role-icon-wrap { background: #64748b; }
    .accent-imm .role-tag { background: #f1f5f9; color: #334155; }
    .accent-mgr .role-icon-wrap { background: #6366f1; }
    .accent-mgr .role-tag { background: #e0e7ff; color: #4338ca; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin-top: 10px;
    }
    th {
      background: #0f3d2e;
      color: #fff;
      padding: 8px 10px;
      text-align: left;
      font-weight: 600;
    }
    td {
      border-bottom: 1px solid #e2e8f0;
      padding: 7px 10px;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: #f8fafc; }

    .demo-box {
      background: #0f3d2e;
      color: #fff;
      border-radius: 10px;
      padding: 14px 16px;
      margin-top: 14px;
    }
    .demo-box h3 { margin: 0 0 10px; font-size: 12pt; }
    .demo-box p { margin: 0; font-size: 9.5pt; opacity: 0.9; }
    .demo-box code {
      background: rgba(255,255,255,0.15);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .footer-note {
      position: absolute;
      bottom: 12mm;
      left: 14mm;
      right: 14mm;
      font-size: 8pt;
      color: #94a3b8;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
    }

    svg { display: block; }
  </style>
</head>
<body>

  <!-- COVER -->
  <section class="page cover">
    <div class="cover-badge">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
        <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/>
        <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span style="font-weight:600;font-size:11pt;">GOVERNMENT COMPLIANCE PORTAL</span>
    </div>
    <h1>DigiPermit</h1>
    <p class="tagline">User Roles Guide — What each role does, why it exists, and how it supports the capstone project</p>
    <p class="cover-meta">
      DS3 × IS3 × IP2 Major Project · June 2026<br/>
      Live app: mrntuli.github.io/DPermit · Group reference document
    </p>
  </section>

  <!-- PURPOSE -->
  <section class="page">
    <div class="page-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f7a5a"><circle cx="12" cy="12" r="10" fill="#eaf6f0"/><path d="M12 8v4M12 16h.01" stroke="#0f3d2e" stroke-width="2" stroke-linecap="round"/></svg>
      <h2>Project purpose</h2>
      <span class="page-num">1</span>
    </div>

    <div class="purpose-box">
      <strong>DigiPermit</strong> is a multi-organisation platform that helps employers, universities, clinics, officers, and foreign nationals
      <strong>record, monitor, verify, and report</strong> on permit compliance — with audit trails, alerts, and analytics.
    </div>

    <div class="disclaimer">
      <div class="disclaimer-title">
        <div class="disclaimer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
            <path d="M12 9v4M12 17h.01" stroke-linecap="round"/>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          </svg>
        </div>
        <div>
          <strong>Academic simulation:</strong> DigiPermit does not issue official government visas. It demonstrates how digital compliance <em>could</em> work.
        </div>
      </div>
    </div>

    <p><strong>Module alignment</strong></p>
    <ul style="margin-top:0;font-size:9.5pt;">
      <li><strong>IS3</strong> — BPMN processes, 3NF database, analytics, IoT checkpoint demo</li>
      <li><strong>IP2</strong> — REST API (40+ endpoints) + Ionic/Angular frontend</li>
      <li><strong>DS3</strong> — Agile delivery, testing, GitHub collaboration</li>
    </ul>

    <p style="margin-top:14px;"><strong>Permit lifecycle (who touches the system)</strong></p>
    <div class="flow">
      <div class="flow-step">
        <div class="flow-step-icon" style="background:#0f3d2e;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>
        </div>
        <strong>Admin</strong><span class="step-desc">Setup orgs &amp; users</span>
      </div>
      <span class="flow-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <div class="flow-step">
        <div class="flow-step-icon" style="background:#1f7a5a;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        </div>
        <strong>HR / Uni / Clinic</strong><span class="step-desc">Capture permits</span>
      </div>
      <span class="flow-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <div class="flow-step">
        <div class="flow-step-icon" style="background:#64748b;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M9 15l2 2 4-4"/></svg>
        </div>
        <strong>Immigration</strong><span class="step-desc">Validate pending</span>
      </div>
      <span class="flow-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <div class="flow-step">
        <div class="flow-step-icon" style="background:#3b82f6;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <strong>Foreign national</strong><span class="step-desc">View permit &amp; QR</span>
      </div>
      <span class="flow-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <div class="flow-step">
        <div class="flow-step-icon" style="background:#f59e0b;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M17 17h4v4"/></svg>
        </div>
        <strong>Verification</strong><span class="step-desc">Checkpoint scan</span>
      </div>
      <span class="flow-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      <div class="flow-step">
        <div class="flow-step-icon" style="background:#6366f1;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
        </div>
        <strong>Manager</strong><span class="step-desc">Reports &amp; audit</span>
      </div>
    </div>

    <p class="footer-note">DigiPermit · User Roles Guide · Capstone 2026</p>
  </section>

  <!-- ROLES 1 -->
  <section class="page">
    <div class="page-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <h2>User roles (1 of 2)</h2>
      <span class="page-num">2</span>
    </div>

    <div class="role-card accent-admin">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </div>
      <div>
        <span class="role-tag">Platform governance</span>
        <h3>System Administrator</h3>
        <p><strong>What:</strong> Creates organisations and user accounts; views platform-wide dashboards, verification logs, analytics, and IoT devices.</p>
        <p><strong>Why:</strong> Someone must own and provision the system — without admin, no other role can log in.</p>
        <p class="contrib">→ Proves multi-tenant governance, RBAC, and FR-3 user/org management.</p>
      </div>
    </div>

    <div class="role-card accent-hr">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
      </div>
      <div>
        <span class="role-tag">Work visa compliance</span>
        <h3>Employer HR Officer</h3>
        <p><strong>What:</strong> Registers foreign employees, captures work permits, monitors expiry, handles renewals, verifies at reception (manual/QR).</p>
        <p><strong>Why:</strong> Employers are responsible for knowing employees’ permit status — main data-entry and day-to-day compliance role.</p>
        <p class="contrib">→ Core use case UC-01; organisation-scoped data; drives permits, alerts, notifications.</p>
      </div>
    </div>

    <div class="role-card accent-uni">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
      </div>
      <div>
        <span class="role-tag">Study visa compliance</span>
        <h3>University Officer</h3>
        <p><strong>What:</strong> Monitors international students and study permits; dashboard and verification at international office.</p>
        <p><strong>Why:</strong> Universities face the same compliance challenge as employers, for study visas.</p>
        <p class="contrib">→ Shows multi-organisation-type design (not employer-only).</p>
      </div>
    </div>

    <div class="role-card accent-clinic">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      </div>
      <div>
        <span class="role-tag">Healthcare monitoring</span>
        <h3>Clinic Administrator</h3>
        <p><strong>What:</strong> Lists patients and permits; org dashboard; verify documents at clinic desk.</p>
        <p><strong>Why:</strong> Clinics may need to confirm immigration document status before care or reporting.</p>
        <p class="contrib">→ Extends compliance to healthcare stakeholder (process variety for IS3).</p>
      </div>
    </div>

    <p class="footer-note">DigiPermit · User Roles Guide</p>
  </section>

  <!-- ROLES 2 -->
  <section class="page">
    <div class="page-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <h2>User roles (2 of 2)</h2>
      <span class="page-num">3</span>
    </div>

    <div class="role-card accent-fn">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div>
        <span class="role-tag">Self-service</span>
        <h3>Foreign National</h3>
        <p><strong>What:</strong> Views own permits only, digital permit + QR, notifications, renewal/update requests.</p>
        <p><strong>Why:</strong> The permit holder should see status and warnings; reduces HR load and improves transparency.</p>
        <p class="contrib">→ Self-scoped access (privacy); renewal BPMN; completes post-validation lifecycle.</p>
      </div>
    </div>

    <div class="role-card accent-verify">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><path d="M17 17h4v4"/></svg>
      </div>
      <div>
        <span class="role-tag">Checkpoint operations</span>
        <h3>Verification Officer</h3>
        <p><strong>What:</strong> Manual lookup, QR scan, RFID simulation; instant valid/expired/revoked result; certificate PDF; own scan logs &amp; analytics.</p>
        <p><strong>Why:</strong> Compliance requires real-time checks at gates/reception — not only database storage.</p>
        <p class="contrib">→ Verification engine + immutable audit logs; IoT demo (IS3); strongest live demo role.</p>
      </div>
    </div>

    <div class="role-card accent-imm">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></svg>
      </div>
      <div>
        <span class="role-tag">Simulated government review</span>
        <h3>Immigration Officer</h3>
        <p><strong>What:</strong> Validates or rejects pending permits; reviews suspicious activity and renewal queue.</p>
        <p><strong>Why:</strong> Records must be approved before treated as active — mirrors pending → active in BPMN.</p>
        <p class="contrib">→ Simulated oversight (not real Home Affairs); links capture to trusted active status.</p>
      </div>
    </div>

    <div class="role-card accent-mgr">
      <div class="role-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
      </div>
      <div>
        <span class="role-tag">Executive oversight</span>
        <h3>Manager / Auditor</h3>
        <p><strong>What:</strong> Read-only analytics, AI executive insights, charts, role-scoped PDF reports — cannot change operational data.</p>
        <p><strong>Why:</strong> Leadership needs visibility without operational power (separation of duties).</p>
        <p class="contrib">→ IS3 reporting + Power BI story; least-privilege audit access.</p>
      </div>
    </div>

    <p class="footer-note">DigiPermit · User Roles Guide</p>
  </section>

  <!-- SUMMARY + DEMO -->
  <section class="page">
    <div class="page-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1f7a5a" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
      <h2>Quick reference</h2>
      <span class="page-num">4</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>Scope</th>
          <th>Changes data?</th>
          <th>Project value</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>System Admin</td><td>Whole platform</td><td>Yes</td><td>Setup &amp; governance</td></tr>
        <tr><td>Employer HR</td><td>One employer</td><td>Yes</td><td>Core permit capture</td></tr>
        <tr><td>University Officer</td><td>One university</td><td>Yes</td><td>Education sector</td></tr>
        <tr><td>Clinic Admin</td><td>One clinic</td><td>Yes</td><td>Healthcare sector</td></tr>
        <tr><td>Foreign National</td><td>Self only</td><td>Limited</td><td>Self-service &amp; privacy</td></tr>
        <tr><td>Verification Officer</td><td>Own scans</td><td>Logs only</td><td>Real-time verify + audit</td></tr>
        <tr><td>Immigration Officer</td><td>Platform review</td><td>Yes</td><td>Approval workflow</td></tr>
        <tr><td>Manager / Auditor</td><td>Read-only</td><td>No</td><td>Analytics &amp; reporting</td></tr>
      </tbody>
    </table>

    <p style="margin-top:16px;font-size:9.5pt;"><strong>Why eight roles?</strong> Each maps to a real stakeholder: who records, who approves, who carries the permit, who checks on the day, who runs the platform, who reports. That demonstrates multi-user RBAC, process integration, and auditability required by the major project.</p>

    <div class="demo-box">
      <h3>
        <span class="demo-icon-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </span>
        Demo access for your group
      </h3>
      <p>
        <strong>URL:</strong> https://mrntuli.github.io/DPermit/<br/>
        <strong>Password (all demo users):</strong> <code>Demo@12345</code><br/>
        <strong>Examples:</strong> <code>admin@digipermit.demo</code> · <code>hr@acme.demo</code> · <code>verify@digipermit.demo</code> · <code>immigration@digipermit.demo</code> · <code>manager@digipermit.demo</code>
      </p>
    </div>

    <p class="footer-note">Full test steps: docs/ROLE-USER-STORIES-TEST-GUIDE.md · System description: docs/MAJOR-PROJECT-SYSTEM-DESCRIPTION.md</p>
  </section>

</body>
</html>
"""


async def main() -> None:
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        import subprocess

        subprocess.check_call([sys.executable, "-m", "pip", "install", "playwright", "-q"])
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])
        from playwright.async_api import async_playwright

    DEST.parent.mkdir(parents=True, exist_ok=True)
    print(f"Generating {DEST.name}...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(HTML, wait_until="networkidle", timeout=120_000)
        await page.pdf(
            path=str(DEST),
            format="A4",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        await browser.close()
    print(f"OK  {DEST} ({DEST.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    asyncio.run(main())
