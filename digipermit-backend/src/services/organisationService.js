const { supabaseAdmin } = require('../config/supabase');
const { validateOrganisationData } = require('../utils/organisationValidation');

async function getAll(filters = {}) {
  let query = supabaseAdmin.from('organisations').select('*').order('created_at', { ascending: false });
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.organisation_type) query = query.eq('organisation_type', filters.organisation_type);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id) {
  const { data, error } = await supabaseAdmin.from('organisations').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

async function create(orgData) {
  const payload = validateOrganisationData(orgData);
  const { data, error } = await supabaseAdmin.from('organisations').insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function update(id, orgData) {
  const { data, error } = await supabaseAdmin.from('organisations').update(orgData).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function deactivate(id) {
  return update(id, { status: 'inactive' });
}

async function archive(id) {
  return update(id, { status: 'archived' });
}

module.exports = { getAll, getById, create, update, deactivate, archive };
