const { supabaseAdmin } = require('../config/supabase');

async function getAll(filters = {}) {
  let query = supabaseAdmin.from('permit_types').select('*').order('name');
  if (filters.is_active !== undefined) query = query.eq('is_active', filters.is_active);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id) {
  const { data, error } = await supabaseAdmin.from('permit_types').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

async function create(typeData) {
  const { data, error } = await supabaseAdmin.from('permit_types').insert(typeData).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function update(id, typeData) {
  const { data, error } = await supabaseAdmin.from('permit_types').update(typeData).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function deactivate(id) {
  return update(id, { is_active: false });
}

module.exports = { getAll, getById, create, update, deactivate };
