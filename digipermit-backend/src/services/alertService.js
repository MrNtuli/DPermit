const { supabaseAdmin } = require('../config/supabase');
const { isPlatformWide, isSelfScoped } = require('../utils/accessScope');

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

  if (isSelfScoped(profile.role) && profile.foreign_national_id) {
    query = query.eq('foreign_national_id', profile.foreign_national_id);
  } else if (!isPlatformWide(profile.role) && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id);
  }
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.priority) query = query.eq('priority', filters.priority);
  if (filters.alert_type) query = query.eq('alert_type', filters.alert_type);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id, profile) {
  const { data, error } = await supabaseAdmin.from('alerts').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  if (profile) {
    if (isSelfScoped(profile.role) && data.foreign_national_id !== profile.foreign_national_id) {
      throw new Error('Access denied');
    }
    if (!isPlatformWide(profile.role) && profile.organisation_id
      && data.organisation_id !== profile.organisation_id) {
      throw new Error('Access denied');
    }
  }
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
