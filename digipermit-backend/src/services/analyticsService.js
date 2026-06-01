const { supabaseAdmin } = require('../config/supabase');

async function getSummary(profile) {
  const orgFilter = profile.role !== 'system_admin' && profile.organisation_id &&
    !['immigration_officer', 'manager', 'auditor'].includes(profile.role)
    ? profile.organisation_id : null;

  const countQuery = async (table, filters = {}) => {
    let q = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
    if (orgFilter && ['permits', 'foreign_nationals', 'alerts', 'renewal_update_requests'].includes(table)) {
      q = q.eq('organisation_id', orgFilter);
    }
    Object.entries(filters).forEach(([k, v]) => { q = q.eq(k, v); });
    const { count } = await q;
    return count || 0;
  };

  const [
    totalOrganisations, totalUsers, totalForeignNationals, totalPermits,
    activePermits, expiringPermits, expiredPermits, revokedPermits,
    pendingVerification, renewalRequests, unresolvedAlerts,
  ] = await Promise.all([
    profile.role === 'system_admin' ? countQuery('organisations', { status: 'active' }) : 0,
    profile.role === 'system_admin' ? countQuery('profiles', { status: 'active' }) : 0,
    countQuery('foreign_nationals', { status: 'active' }),
    countQuery('permits'),
    countQuery('permits', { status: 'active' }),
    countQuery('permits', { status: 'expiring_soon' }),
    countQuery('permits', { status: 'expired' }),
    countQuery('permits', { status: 'revoked' }),
    countQuery('permits', { status: 'pending_verification' }),
    countQuery('renewal_update_requests', { status: 'pending' }),
    countQuery('alerts', { status: 'open' }),
  ]);

  const { data: recentVerifications } = await supabaseAdmin
    .from('verification_logs')
    .select('verification_result, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const successful = recentVerifications?.filter(v => v.verification_result === 'valid').length || 0;
  const failed = recentVerifications?.filter(v => ['expired', 'revoked', 'not_found', 'suspicious'].includes(v.verification_result)).length || 0;

  return {
    total_organisations: totalOrganisations,
    total_users: totalUsers,
    total_foreign_nationals: totalForeignNationals,
    total_permits: totalPermits,
    active_permits: activePermits,
    expiring_permits: expiringPermits,
    expired_permits: expiredPermits,
    revoked_permits: revokedPermits,
    pending_verification: pendingVerification,
    renewal_requests: renewalRequests,
    successful_verifications: successful,
    failed_verifications: failed,
    unresolved_alerts: unresolvedAlerts,
  };
}

async function getExpiryAnalytics() {
  const { data } = await supabaseAdmin.from('vw_expiring_permits').select('*').limit(100);
  return data || [];
}

async function getVerificationAnalytics() {
  const { data } = await supabaseAdmin.from('vw_verification_summary').select('*').limit(100);
  return data || [];
}

async function getAlertAnalytics() {
  const { data } = await supabaseAdmin.from('vw_alert_summary').select('*');
  return data || [];
}

async function getPermitTypeAnalytics() {
  const { data } = await supabaseAdmin.from('permits').select('permit_type_id, permit_types(name), status');
  const summary = {};
  (data || []).forEach(p => {
    const name = p.permit_types?.name || 'Unknown';
    if (!summary[name]) summary[name] = { total: 0, active: 0, expired: 0 };
    summary[name].total++;
    if (p.status === 'active') summary[name].active++;
    if (p.status === 'expired') summary[name].expired++;
  });
  return summary;
}

async function getOrganisationAnalytics() {
  const { data: employer } = await supabaseAdmin.from('vw_employer_compliance').select('*');
  const { data: university } = await supabaseAdmin.from('vw_university_compliance').select('*');
  return { employer: employer || [], university: university || [] };
}

async function getSuspiciousActivity() {
  const { data } = await supabaseAdmin.from('alerts')
    .select('*')
    .in('alert_type', ['qr_mismatch', 'rfid_mismatch', 'excessive_scans', 'repeated_invalid_attempts', 'revoked_permit_scan'])
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}

async function getAiInsights(profile) {
  const summary = await getSummary(profile);
  const suspicious = await getSuspiciousActivity();
  const expiring = await getExpiryAnalytics();

  const insights = [];
  const recommendations = [];

  if (summary.expired_permits > 0) {
    insights.push(`${summary.expired_permits} permit(s) are expired — immediate compliance follow-up required.`);
    recommendations.push('Contact affected foreign nationals and HR officers to initiate renewal workflows.');
  }
  if (summary.expiring_permits > 0) {
    insights.push(`${summary.expiring_permits} permit(s) are expiring within 30 days.`);
    recommendations.push('Schedule renewal reminders and review pending update requests.');
  }
  if (summary.unresolved_alerts > 0) {
    insights.push(`${summary.unresolved_alerts} unresolved alert(s) require attention.`);
  }
  if (suspicious.length > 0) {
    insights.push(`${suspicious.length} suspicious-activity alert(s) detected at verification checkpoints.`);
    recommendations.push('Review verification logs and investigate QR/RFID mismatches or revoked permit scans.');
  }
  if (summary.pending_verification > 0) {
    insights.push(`${summary.pending_verification} permit record(s) await compliance officer validation.`);
    recommendations.push('Assign immigration officer to validate pending captures.');
  }

  const soon = (expiring || []).filter(e => e.days_until_expiry >= 0 && e.days_until_expiry <= 14);
  soon.slice(0, 3).forEach(e => {
    insights.push(`${e.permit_type} ${e.permit_number} for ${e.foreign_national_name} expires in ${e.days_until_expiry} day(s).`);
  });

  if (insights.length === 0) {
    insights.push('No critical compliance risks detected at this time.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue routine monitoring via dashboards and scheduled expiry checks.');
  }

  let risk_level = 'low';
  if (summary.expired_permits > 0 || suspicious.length > 0) risk_level = 'elevated';
  else if (summary.expiring_permits > 0 || summary.unresolved_alerts > 0) risk_level = 'moderate';

  return {
    generated_at: new Date().toISOString(),
    risk_level,
    summary: `Platform monitoring ${summary.total_foreign_nationals} foreign national(s) and ${summary.total_permits} permit record(s).`,
    metrics: summary,
    insights,
    recommendations,
    methodology: 'Rule-based analytics with template-generated executive summary (AI workflow layer).',
  };
}

module.exports = {
  getSummary, getExpiryAnalytics, getVerificationAnalytics,
  getAlertAnalytics, getPermitTypeAnalytics, getOrganisationAnalytics, getSuspiciousActivity,
  getAiInsights,
};
