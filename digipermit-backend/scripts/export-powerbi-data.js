/**
 * Export DigiPermit analytics views to CSV for Power BI (Import from folder).
 * Uses Supabase REST + service role — no PostgreSQL connector required.
 *
 * Run from digipermit-backend:
 *   node scripts/export-powerbi-data.js
 *
 * Output: ../docs/power-bi/data/*.csv
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const VIEWS = [
  'vw_permit_status_summary',
  'vw_expiring_permits',
  'vw_verification_summary',
  'vw_alert_summary',
  'vw_employer_compliance',
  'vw_university_compliance',
  'vw_iot_scan_summary',
];

const OUT_DIR = path.join(__dirname, '..', '..', 'docs', 'power-bi', 'data');

function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const header = keys.join(',');
  const body = rows.map((r) => keys.map((k) => escape(r[k])).join(',')).join('\n');
  return `${header}\n${body}`;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in digipermit-backend/.env');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const supabase = createClient(url, key);

  let ok = 0;
  for (const view of VIEWS) {
    const { data, error } = await supabase.from(view).select('*');
    if (error) {
      console.error(`[FAIL] ${view}: ${error.message}`);
      console.error('  → Run database/views/analytics_views.sql in Supabase SQL Editor if views are missing.');
      continue;
    }
    const file = path.join(OUT_DIR, `${view}.csv`);
    fs.writeFileSync(file, toCsv(data || []), 'utf8');
    console.log(`[OK] ${view} → ${data?.length ?? 0} rows → ${file}`);
    ok++;
  }

  if (ok === 0) {
    process.exit(1);
  }
  console.log(`\nDone. ${ok}/${VIEWS.length} files in docs/power-bi/data/`);
  console.log('Open Power BI → Get data → Text/CSV → select folder or each file.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
