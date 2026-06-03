const { supabaseAdmin } = require('../config/supabase');
const authService = require('./authService');
const { validateCreateUserPayload } = require('../utils/userValidation');

async function getAll(profile, filters = {}) {
  let query = supabaseAdmin
    .from('profiles')
    .select('*, organisations(id, name, organisation_type)')
    .order('created_at', { ascending: false });

  if (profile.role !== 'system_admin' && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id);
  }
  if (filters.role) query = query.eq('role', filters.role);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id, profile) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*, organisations(id, name, organisation_type), foreign_nationals(id, full_name)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  if (profile.role !== 'system_admin' && data.organisation_id !== profile.organisation_id) {
    throw new Error('Access denied');
  }
  return data;
}

async function create(userData, creatorProfile) {
  if (creatorProfile.role !== 'system_admin') {
    throw new Error('Only system administrators can create users');
  }
  await validateCreateUserPayload(userData, supabaseAdmin);
  return authService.signup(userData);
}

async function update(id, updates, profile) {
  if (profile.role !== 'system_admin' && profile.id !== id) {
    throw new Error('Access denied');
  }
  const allowed = ['full_name', 'phone_number', 'status'];
  if (profile.role === 'system_admin') {
    allowed.push('role', 'organisation_id', 'foreign_national_id');
  }
  const filtered = {};
  allowed.forEach(k => { if (updates[k] !== undefined) filtered[k] = updates[k]; });

  const { data, error } = await supabaseAdmin.from('profiles').update(filtered).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function deactivate(id) {
  return update(id, { status: 'inactive' }, { role: 'system_admin' });
}

module.exports = { getAll, getById, create, update, deactivate };
