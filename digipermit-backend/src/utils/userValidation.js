const { ALL_ROLES } = require('../middleware/roleMiddleware');

const ORG_REQUIRED_ROLES = ['employer_hr', 'university_officer', 'clinic_admin', 'foreign_national'];

async function validateCreateUserPayload(data, supabaseAdmin) {
  const { email, password, full_name, role, organisation_id, foreign_national_id } = data;

  if (!email || !password || !full_name || !role) {
    throw new Error('Email, password, full name, and role are required');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!ALL_ROLES.includes(role)) {
    throw new Error('Invalid role');
  }
  if (ORG_REQUIRED_ROLES.includes(role) && !organisation_id) {
    throw new Error('Organisation is required for this role');
  }
  if (role === 'foreign_national') {
    if (!foreign_national_id) {
      throw new Error('Link a foreign national record for self-service login');
    }
    const { data: fn, error: fnError } = await supabaseAdmin
      .from('foreign_nationals')
      .select('id, organisation_id, full_name')
      .eq('id', foreign_national_id)
      .single();
    if (fnError || !fn) throw new Error('Foreign national record not found');
    if (fn.organisation_id !== organisation_id) {
      throw new Error('Foreign national must belong to the selected organisation');
    }
    const { data: linked } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('foreign_national_id', foreign_national_id)
      .neq('status', 'inactive')
      .maybeSingle();
    if (linked) throw new Error('This foreign national already has an active login account');
  }
  if (organisation_id) {
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organisations')
      .select('id')
      .eq('id', organisation_id)
      .eq('status', 'active')
      .maybeSingle();
    if (orgError || !org) throw new Error('Organisation not found or inactive');
  }
}

module.exports = { validateCreateUserPayload, ORG_REQUIRED_ROLES };
