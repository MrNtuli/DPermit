const { supabaseAdmin } = require('../config/supabase');
const env = require('../config/env');
const { computeVerificationResult, daysUntilExpiry } = require('../utils/expiryCalculator');
const { maskPassport } = require('../utils/maskPassport');
const permitService = require('./permitService');
const alertService = require('./alertService');

async function countRecentScans(permitId, hours = 1) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from('verification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('permit_id', permitId)
    .gte('created_at', since);
  return count || 0;
}

async function countInvalidAttempts(verifiedBy, hours = 1) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from('verification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('verified_by', verifiedBy)
    .eq('verification_result', 'not_found')
    .gte('created_at', since);
  return count || 0;
}

async function checkSuspiciousActivity(permit, result, scanType, qrValue, rfidTag, profile) {
  const alerts = [];

  if (result === 'suspicious') {
    alerts.push({
      alert_type: scanType === 'qr' ? 'qr_mismatch' : 'rfid_mismatch',
      priority: 'critical',
      message: `${scanType.toUpperCase()} mismatch detected for permit ${permit?.permit_number || 'unknown'}.`,
    });
  }

  if (permit && ['expired', 'revoked', 'rejected'].includes(result)) {
    alerts.push({
      alert_type: `${result}_permit_scan`,
      priority: result === 'revoked' ? 'critical' : 'high',
      message: `${result.charAt(0).toUpperCase() + result.slice(1)} permit ${permit.permit_number} was scanned.`,
    });
  }

  if (permit) {
    const recentScans = await countRecentScans(permit.id);
    if (recentScans >= env.maxScansPerHour) {
      alerts.push({
        alert_type: 'excessive_scans',
        priority: 'high',
        message: `Permit ${permit.permit_number} scanned ${recentScans + 1} times within one hour.`,
      });
      result = 'suspicious';
    }
  }

  if (!permit && profile) {
    const invalidCount = await countInvalidAttempts(profile.id);
    if (invalidCount >= env.maxInvalidAttempts) {
      alerts.push({
        alert_type: 'repeated_invalid_attempts',
        priority: 'high',
        message: `Repeated invalid permit lookup attempts detected.`,
      });
    }
  }

  return { result, alerts };
}

async function buildVerificationResponse(permit, result, scanType) {
  if (!permit) {
    return {
      verification_result: 'not_found',
      scan_type: scanType,
      timestamp: new Date().toISOString(),
      warning_message: 'No permit record found for the provided identifier.',
    };
  }

  const days = daysUntilExpiry(permit.expiry_date);
  let warning = null;
  if (result === 'expired') warning = 'This permit has expired. Compliance action required.';
  if (result === 'revoked') warning = 'This permit has been revoked and is not valid for use.';
  if (result === 'rejected') warning = 'This permit record was rejected during verification.';
  if (result === 'suspicious') warning = 'Suspicious activity detected. Further investigation required.';
  if (result === 'expiring_soon') warning = `Permit expires in ${days} day(s). Renewal action recommended.`;

  return {
    foreign_national_name: permit.foreign_nationals?.full_name,
    masked_passport_number: maskPassport(permit.passport_number),
    permit_number: permit.permit_number,
    permit_type: permit.permit_types?.name,
    organisation: permit.organisations?.name,
    issue_date: permit.issue_date,
    expiry_date: permit.expiry_date,
    permit_status: permit.status,
    verification_result: result,
    scan_type: scanType,
    timestamp: new Date().toISOString(),
    warning_message: warning,
    days_until_expiry: days,
  };
}

async function logVerification({ permitId, profile, organisationId, scanType, result, note, deviceId, ipAddress }) {
  const { data, error } = await supabaseAdmin.from('verification_logs').insert({
    permit_id: permitId,
    verified_by: profile?.id,
    organisation_id: organisationId || profile?.organisation_id,
    scan_type: scanType,
    verification_result: result,
    verification_note: note,
    device_id: deviceId,
    ip_address: ipAddress,
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function verifyByNumber(permitNumber, profile, options = {}) {
  const permit = await permitService.findByNumber(permitNumber);
  let result = computeVerificationResult(permit);
  const { result: finalResult, alerts } = await checkSuspiciousActivity(permit, result, 'manual', null, null, profile);

  await logVerification({
    permitId: permit?.id,
    profile,
    organisationId: permit?.organisation_id,
    scanType: 'manual',
    result: finalResult,
    note: options.note,
    deviceId: options.deviceId,
    ipAddress: options.ipAddress,
  });

  for (const alert of alerts) {
    await alertService.create({
      permit_id: permit?.id,
      foreign_national_id: permit?.foreign_national_id,
      organisation_id: permit?.organisation_id || profile.organisation_id,
      ...alert,
    });
  }

  return buildVerificationResponse(permit, finalResult, 'manual');
}

async function verifyByQr(qrValue, profile, options = {}) {
  const permitNumber = qrValue.replace('DIGIPERMIT:', '');
  const permit = await permitService.findByNumber(permitNumber);
  const qrMatch = permit ? permit.qr_code_value === qrValue : false;
  let result = computeVerificationResult(permit, qrMatch, true);
  const { result: finalResult, alerts } = await checkSuspiciousActivity(permit, result, 'qr', qrValue, null, profile);

  await logVerification({
    permitId: permit?.id,
    profile,
    organisationId: permit?.organisation_id,
    scanType: 'qr',
    result: finalResult,
    note: options.note,
    deviceId: options.deviceId,
    ipAddress: options.ipAddress,
  });

  for (const alert of alerts) {
    await alertService.create({ permit_id: permit?.id, foreign_national_id: permit?.foreign_national_id, organisation_id: permit?.organisation_id, ...alert });
  }

  return buildVerificationResponse(permit, finalResult, 'qr');
}

async function verifyByRfid(rfidTag, profile, options = {}) {
  const permit = await permitService.findByRfid(rfidTag);
  const rfidMatch = permit ? permit.rfid_tag === rfidTag : false;
  let result = computeVerificationResult(permit, true, rfidMatch);
  const { result: finalResult, alerts } = await checkSuspiciousActivity(permit, result, 'rfid', null, rfidTag, profile);

  await logVerification({
    permitId: permit?.id,
    profile,
    organisationId: permit?.organisation_id,
    scanType: 'rfid',
    result: finalResult,
    note: options.note,
    deviceId: options.deviceId,
    ipAddress: options.ipAddress,
  });

  for (const alert of alerts) {
    await alertService.create({ permit_id: permit?.id, foreign_national_id: permit?.foreign_national_id, organisation_id: permit?.organisation_id, ...alert });
  }

  return buildVerificationResponse(permit, finalResult, 'rfid');
}

/** Roles that see all verification logs (platform oversight). */
const PLATFORM_WIDE_LOG_ROLES = [
  'system_admin',
  'immigration_officer',
  'manager',
  'auditor',
];

/**
 * Log list scoping:
 * - Checkpoint officers: scans they performed (cross-org; org on row = permit employer).
 * - Employer / university / clinic: scans for permits at their organisation.
 * - Platform roles: all logs.
 */
function applyLogScope(query, profile, filters = {}) {
  if (filters.verified_by) {
    return query.eq('verified_by', filters.verified_by);
  }
  if (profile.role === 'verification_officer') {
    return query.eq('verified_by', profile.id);
  }
  if (
    profile.organisation_id
    && !PLATFORM_WIDE_LOG_ROLES.includes(profile.role)
  ) {
    return query.eq('organisation_id', profile.organisation_id);
  }
  return query;
}

async function getLogs(profile, filters = {}) {
  let query = supabaseAdmin.from('verification_logs').select(`
    *,
    permits(permit_number, status),
    profiles!verification_logs_verified_by_fkey(full_name, role),
    organisations(name)
  `).order('created_at', { ascending: false });

  query = applyLogScope(query, profile, filters);

  if (filters.scan_type) query = query.eq('scan_type', filters.scan_type);
  if (filters.verification_result) query = query.eq('verification_result', filters.verification_result);

  const limit = Math.min(parseInt(filters.limit, 10) || 100, 500);
  const { data, error } = await query.limit(limit);
  if (error) throw new Error(error.message);
  return data;
}

async function getLogById(id) {
  const { data, error } = await supabaseAdmin.from('verification_logs').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}

module.exports = { verifyByNumber, verifyByQr, verifyByRfid, getLogs, getLogById, buildVerificationResponse };
