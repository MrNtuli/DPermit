/**
 * Seed demo users via Supabase Admin API.
 * Run AFTER SQL migrations and data seeds (002-005).
 * Usage: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_PASSWORD = 'Demo@12345';

const users = [
  { email: 'admin@digipermit.demo', full_name: 'System Administrator', role: 'system_admin', org: null, fn: null },
  { email: 'hr@acmeglobal.demo', full_name: 'John Mbeki', role: 'employer_hr', org: 'a1000001-0000-4000-8000-000000000001', fn: null },
  { email: 'james.okonkwo@demo.mail', full_name: 'James Okonkwo', role: 'foreign_national', org: 'a1000001-0000-4000-8000-000000000001', fn: 'b2000001-0000-4000-8000-000000000001' },
  { email: 'priya.sharma@demo.mail', full_name: 'Priya Sharma', role: 'foreign_national', org: 'a1000001-0000-4000-8000-000000000001', fn: 'b2000001-0000-4000-8000-000000000002' },
  { email: 'international@metrouni.demo', full_name: 'Dr. Anna van der Berg', role: 'university_officer', org: 'a1000001-0000-4000-8000-000000000002', fn: null },
  { email: 'maria.santos@demo.mail', full_name: 'Maria Santos', role: 'foreign_national', org: 'a1000001-0000-4000-8000-000000000002', fn: 'b2000001-0000-4000-8000-000000000003' },
  { email: 'admin@citywellness.demo', full_name: 'Dr. Lin Wei', role: 'clinic_admin', org: 'a1000001-0000-4000-8000-000000000003', fn: null },
  { email: 'verify@digipermit.demo', full_name: 'Officer Chen', role: 'verification_officer', org: 'a1000001-0000-4000-8000-000000000004', fn: null },
  { email: 'compliance@digipermit.demo', full_name: 'Sarah Compliance', role: 'immigration_officer', org: 'a1000001-0000-4000-8000-000000000004', fn: null },
  { email: 'audit@natcompliance.demo', full_name: 'Audit Manager', role: 'manager', org: 'a1000001-0000-4000-8000-000000000005', fn: null },
];

async function seedUsers() {
  console.log('Seeding demo users...\n');

  for (const u of users) {
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', u.email).maybeSingle();
    if (existing) {
      console.log(`  Skip (exists): ${u.email}`);
      continue;
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });

    if (authError) {
      console.error(`  Failed auth for ${u.email}:`, authError.message);
      continue;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      auth_user_id: authData.user.id,
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      organisation_id: u.org,
      foreign_national_id: u.fn,
      status: 'active',
    });

    if (profileError) {
      console.error(`  Failed profile for ${u.email}:`, profileError.message);
      await supabase.auth.admin.deleteUser(authData.user.id);
    } else {
      console.log(`  Created: ${u.email} (${u.role})`);
    }
  }

  // Seed sample notifications for James
  const { data: jamesProfile } = await supabase.from('profiles').select('id').eq('email', 'james.okonkwo@demo.mail').single();
  if (jamesProfile) {
    await supabase.from('notifications').upsert([
      {
        profile_id: jamesProfile.id,
        permit_id: 'c3000001-0000-4000-8000-000000000001',
        title: 'Work Visa Active',
        message: 'Your General work visa WP-2024-ACME-001 is active and valid.',
        notification_type: 'status_update',
        priority: 'normal',
        is_read: false,
      },
      {
        profile_id: jamesProfile.id,
        permit_id: 'c3000001-0000-4000-8000-000000000010',
        title: 'Renewal In Progress',
        message: 'Your permanent residence permit renewal request is being reviewed.',
        notification_type: 'renewal_update',
        priority: 'normal',
        is_read: false,
      },
    ], { onConflict: 'id', ignoreDuplicates: true });
  }

  // Seed verification logs
  const { data: verifyProfile } = await supabase.from('profiles').select('id').eq('email', 'verify@digipermit.demo').single();
  if (verifyProfile) {
    const logs = [
      { permit_id: 'c3000001-0000-4000-8000-000000000001', verified_by: verifyProfile.id, organisation_id: 'a1000001-0000-4000-8000-000000000001', scan_type: 'manual', verification_result: 'valid' },
      { permit_id: 'c3000001-0000-4000-8000-000000000003', verified_by: verifyProfile.id, organisation_id: 'a1000001-0000-4000-8000-000000000001', scan_type: 'manual', verification_result: 'expired' },
      { permit_id: 'c3000001-0000-4000-8000-000000000004', verified_by: verifyProfile.id, organisation_id: 'a1000001-0000-4000-8000-000000000001', scan_type: 'qr', verification_result: 'revoked' },
    ];
    for (const log of logs) {
      const { count } = await supabase.from('verification_logs').select('*', { count: 'exact', head: true }).eq('permit_id', log.permit_id).eq('verification_result', log.verification_result);
      if (!count) await supabase.from('verification_logs').insert(log);
    }
  }

  console.log(`\nDemo password for all users: ${DEMO_PASSWORD}`);
  console.log('Seed complete.');
}

seedUsers().catch(console.error);
