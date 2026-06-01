const { supabaseAdmin } = require('../config/supabase');

async function create(alertData) {
  const { data, error } = await supabaseAdmin.from('alerts').insert({
    ...alertData,
    status: 'open',
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function getAll(profile, filters = {}) {
  let query = supabaseAdmin.from('alerts').select(`
    *, permits(permit_number), foreign_nationals(full_name), organisations(name)
  `).order('created_at', { ascending: false });

  if (profile.role !== 'system_admin' && profile.organisation_id &&
    !['immigration_officer', 'manager', 'auditor'].includes(profile.role)) {
    query = query.eq('organisation_id', profile.organisation_id);
  }
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.priority) query = query.eq('priority', filters.priority);
  if (filters.alert_type) query = query.eq('alert_type', filters.alert_type);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id) {
  const { data, error } = await supabaseAdmin.from('alerts').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

async function resolve(id, profile) {
  const { data, error } = await supabaseAdmin.from('alerts').update({
    status: 'resolved',
    resolved_by: profile.id,
    resolved_at: new Date().toISOString(),
  }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

module.exports = { create, getAll, getById, resolve };
