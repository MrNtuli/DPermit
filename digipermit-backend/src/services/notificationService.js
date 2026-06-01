const { supabaseAdmin } = require('../config/supabase');

async function create({ profile_id, permit_id, title, message, notification_type = 'general', priority = 'normal' }) {
  const { data, error } = await supabaseAdmin.from('notifications').insert({
    profile_id, permit_id, title, message, notification_type, priority,
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function getAll(profile, filters = {}) {
  let query = supabaseAdmin.from('notifications')
    .select('*, permits(permit_number)')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false });

  if (filters.is_read !== undefined) query = query.eq('is_read', filters.is_read === 'true' || filters.is_read === true);
  if (filters.notification_type) query = query.eq('notification_type', filters.notification_type);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function markAsRead(id, profile) {
  const { data, error } = await supabaseAdmin.from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('profile_id', profile.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function notifyOrganisationOfficers(organisationId, notification) {
  const { data: officers } = await supabaseAdmin.from('profiles')
    .select('id')
    .eq('organisation_id', organisationId)
    .in('role', ['employer_hr', 'university_officer', 'clinic_admin']);

  if (officers) {
    for (const officer of officers) {
      await create({ profile_id: officer.id, ...notification });
    }
  }
}

async function notifyForeignNational(foreignNationalId, notification) {
  const { data: profiles } = await supabaseAdmin.from('profiles')
    .select('id')
    .eq('foreign_national_id', foreignNationalId);

  if (profiles) {
    for (const p of profiles) {
      await create({ profile_id: p.id, ...notification });
    }
  }
}

module.exports = { create, getAll, markAsRead, notifyOrganisationOfficers, notifyForeignNational };
