const { supabaseAdmin } = require('../config/supabase');
const { canAccessOrganisation } = require('../middleware/roleMiddleware');

async function getAll(profile, filters = {}) {
  let query = supabaseAdmin.from('renewal_update_requests').select(`
    *, permits(permit_number, status), foreign_nationals(full_name)
  `).order('created_at', { ascending: false });

  if (profile.role === 'foreign_national' && profile.foreign_national_id) {
    query = query.eq('foreign_national_id', profile.foreign_national_id);
  } else if (profile.role !== 'system_admin' && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id);
  }
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id, profile) {
  const { data, error } = await supabaseAdmin.from('renewal_update_requests').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  if (profile.role === 'foreign_national' && data.foreign_national_id !== profile.foreign_national_id) {
    throw new Error('Access denied');
  }
  return data;
}

async function create(requestData, profile) {
  const fnId = profile.role === 'foreign_national' ? profile.foreign_national_id : requestData.foreign_national_id;
  const { data, error } = await supabaseAdmin.from('renewal_update_requests').insert({
    ...requestData,
    foreign_national_id: fnId,
    organisation_id: requestData.organisation_id || profile.organisation_id,
    status: 'pending',
  }).select().single();
  if (error) throw new Error(error.message);

  if (requestData.permit_id) {
    await supabaseAdmin.from('permits').update({ status: 'renewal_in_progress' }).eq('id', requestData.permit_id);
  }
  return data;
}

async function review(id, status, profile, notes) {
  const { data, error } = await supabaseAdmin.from('renewal_update_requests').update({
    status,
    reviewed_by: profile.id,
    reviewed_at: new Date().toISOString(),
    notes: notes || undefined,
  }).eq('id', id).select().single();
  if (error) throw new Error(error.message);

  if (status === 'approved' && data.new_expiry_date && data.permit_id) {
    await supabaseAdmin.from('permits').update({
      expiry_date: data.new_expiry_date,
      status: 'active',
    }).eq('id', data.permit_id);
  }
  return data;
}

module.exports = { getAll, getById, create, review };
