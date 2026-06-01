const { supabaseAdmin } = require('../config/supabase');
const { canAccessOrganisation } = require('../middleware/roleMiddleware');

async function getAll(profile, filters = {}) {
  let query = supabaseAdmin
    .from('foreign_nationals')
    .select('*, organisations(id, name, organisation_type)')
    .order('created_at', { ascending: false });

  if (profile.role === 'foreign_national' && profile.foreign_national_id) {
    query = query.eq('id', profile.foreign_national_id);
  } else if (profile.role !== 'system_admin' && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id);
  }

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.foreign_national_type) query = query.eq('foreign_national_type', filters.foreign_national_type);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id, profile) {
  const { data, error } = await supabaseAdmin
    .from('foreign_nationals')
    .select('*, organisations(id, name, organisation_type)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);

  if (profile.role === 'foreign_national' && profile.foreign_national_id !== id) {
    throw new Error('Access denied');
  }
  if (profile.role !== 'system_admin' && profile.role !== 'foreign_national' &&
      !canAccessOrganisation(profile, data.organisation_id)) {
    throw new Error('Access denied');
  }
  return data;
}

async function create(fnData, profile) {
  const orgId = profile.role === 'system_admin' ? fnData.organisation_id : profile.organisation_id;
  if (!orgId) throw new Error('Organisation is required');

  const { data, error } = await supabaseAdmin
    .from('foreign_nationals')
    .insert({ ...fnData, organisation_id: orgId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function update(id, fnData, profile) {
  const existing = await getById(id, profile);
  if (profile.role !== 'system_admin' && !canAccessOrganisation(profile, existing.organisation_id)) {
    throw new Error('Access denied');
  }
  const { data, error } = await supabaseAdmin
    .from('foreign_nationals')
    .update(fnData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function archive(id, profile) {
  return update(id, { status: 'archived' }, profile);
}

module.exports = { getAll, getById, create, update, archive };
