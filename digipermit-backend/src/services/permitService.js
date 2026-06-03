const { supabaseAdmin } = require('../config/supabase');
const { canAccessOrganisation } = require('../middleware/roleMiddleware');
const { canListAllPermits, isSelfScoped } = require('../utils/accessScope');
const { generateQrValue, generateRfidTag, computePermitStatus } = require('../utils/expiryCalculator');

const PERMIT_SELECT = `
  *,
  permit_types(id, name, category),
  foreign_nationals(id, full_name, passport_number, nationality, foreign_national_type),
  organisations(id, name, organisation_type)
`;

async function getAll(profile, filters = {}) {
  let query = supabaseAdmin.from('permits').select(PERMIT_SELECT).order('created_at', { ascending: false });

  if (isSelfScoped(profile.role) && profile.foreign_national_id) {
    query = query.eq('foreign_national_id', profile.foreign_national_id);
  } else if (!canListAllPermits(profile) && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id);
  }

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.organisation_id) query = query.eq('organisation_id', filters.organisation_id);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getById(id, profile) {
  const { data, error } = await supabaseAdmin.from('permits').select(PERMIT_SELECT).eq('id', id).single();
  if (error) throw new Error(error.message);

  if (isSelfScoped(profile.role) && data.foreign_national_id !== profile.foreign_national_id) {
    throw new Error('Access denied');
  }
  if (!canListAllPermits(profile) && !isSelfScoped(profile.role) &&
    !canAccessOrganisation(profile, data.organisation_id)) {
    throw new Error('Access denied');
  }
  return data;
}

async function findByNumber(permitNumber) {
  const { data, error } = await supabaseAdmin.from('permits').select(PERMIT_SELECT).eq('permit_number', permitNumber).single();
  if (error) return null;
  return data;
}

async function findByRfid(rfidTag) {
  const { data, error } = await supabaseAdmin.from('permits').select(PERMIT_SELECT).eq('rfid_tag', rfidTag).single();
  if (error) return null;
  return data;
}

async function create(permitData, profile) {
  const orgId = profile.role === 'system_admin' ? permitData.organisation_id : profile.organisation_id;
  const qrValue = generateQrValue(permitData.permit_number);
  const rfidTag = permitData.rfid_tag || generateRfidTag();

  const { data, error } = await supabaseAdmin.from('permits').insert({
    ...permitData,
    organisation_id: orgId,
    qr_code_value: qrValue,
    rfid_tag: rfidTag,
    captured_by: profile.id,
    status: permitData.status || 'pending_verification',
    verification_status: 'pending',
  }).select(PERMIT_SELECT).single();

  if (error) throw new Error(error.message);
  return data;
}

async function update(id, permitData, profile) {
  await getById(id, profile);
  const { data, error } = await supabaseAdmin.from('permits').update(permitData).eq('id', id).select(PERMIT_SELECT).single();
  if (error) throw new Error(error.message);
  return data;
}

async function validate(id, profile) {
  const permit = await getById(id, profile);
  const status = computePermitStatus(permit.expiry_date, 'active');
  return update(id, {
    verification_status: 'validated',
    validated_by: profile.id,
    validated_at: new Date().toISOString(),
    status,
  }, profile);
}

async function reject(id, reason, profile) {
  return update(id, { status: 'rejected', verification_status: 'rejected', revocation_reason: reason }, profile);
}

async function revoke(id, reason, profile) {
  return update(id, { status: 'revoked', verification_status: 'revoked', revocation_reason: reason }, profile);
}

async function archive(id, profile) {
  return update(id, { status: 'archived' }, profile);
}

module.exports = { getAll, getById, findByNumber, findByRfid, create, update, validate, reject, revoke, archive };
