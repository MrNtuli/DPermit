const { supabaseAdmin } = require('../config/supabase');

function getOrgFilter(profile) {
  if (profile.role === 'system_admin') return null;
  if (['immigration_officer', 'manager', 'auditor'].includes(profile.role)) return null;
  return profile.organisation_id || null;
}

function canSelectOrganisation(profile) {
  return ['system_admin', 'immigration_officer', 'manager', 'auditor'].includes(profile.role);
}

function resolveOrgFilter(profile, requestedOrgId) {
  const forced = getOrgFilter(profile);
  if (forced) return forced;
  if (requestedOrgId && canSelectOrganisation(profile)) return requestedOrgId;
  return null;
}

function parseAnalyticsFilters(query = {}) {
  const days = parseInt(query.days, 10);
  return {
    organisation_id: query.organisation_id || null,
    days: Number.isFinite(days) ? Math.min(Math.max(days, 7), 90) : 14,
    scan_type: query.scan_type || null,
    verification_result: query.verification_result || null,
    permit_status: query.permit_status || null,
    alert_status: query.alert_status || 'open',
  };
}

function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

async function getFilterOptions(profile) {
  const organisations = [];
  if (canSelectOrganisation(profile)) {
    const { data } = await supabaseAdmin
      .from('organisations')
      .select('id, name, organisation_type')
      .eq('status', 'active')
      .order('name');
    organisations.push(...(data || []));
  } else if (profile.organisation_id) {
    const { data } = await supabaseAdmin
      .from('organisations')
      .select('id, name, organisation_type')
      .eq('id', profile.organisation_id)
      .maybeSingle();
    if (data) organisations.push(data);
  }

  return {
    can_filter_organisation: canSelectOrganisation(profile),
    organisations,
    periods: [
      { value: 7, label: 'Last 7 days' },
      { value: 14, label: 'Last 14 days' },
      { value: 30, label: 'Last 30 days' },
      { value: 90, label: 'Last 90 days' },
    ],
    scan_types: [
      { value: '', label: 'All scan types' },
      { value: 'manual', label: 'Manual lookup' },
      { value: 'qr', label: 'QR scan' },
      { value: 'rfid', label: 'RFID scan' },
    ],
    verification_results: [
      { value: '', label: 'All results' },
      { value: 'valid', label: 'Valid' },
      { value: 'expiring_soon', label: 'Expiring soon' },
      { value: 'pending_verification', label: 'Pending verification' },
      { value: 'expired', label: 'Expired' },
      { value: 'revoked', label: 'Revoked' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'not_found', label: 'Not found' },
      { value: 'suspicious', label: 'Suspicious' },
    ],
    permit_statuses: [
      { value: '', label: 'All permit statuses' },
      { value: 'active', label: 'Active' },
      { value: 'expiring_soon', label: 'Expiring soon' },
      { value: 'expired', label: 'Expired' },
      { value: 'revoked', label: 'Revoked' },
      { value: 'pending_verification', label: 'Pending verification' },
    ],
    alert_statuses: [
      { value: 'open', label: 'Open alerts' },
      { value: 'resolved', label: 'Resolved alerts' },
      { value: 'all', label: 'All alerts' },
    ],
  };
}

/** Verification logs scoped by linked permit (employer org + permit status), not verifier's org. */
async function fetchVerificationLogs(filters, orgFilter, since) {
  const scopeByPermit = Boolean(orgFilter || filters.permit_status);

  let logQuery;
  if (scopeByPermit) {
    logQuery = supabaseAdmin
      .from('verification_logs')
      .select('created_at, verification_result, scan_type, permits!inner(organisation_id, status)')
      .gte('created_at', since)
      .not('permit_id', 'is', null);
    if (orgFilter) logQuery = logQuery.eq('permits.organisation_id', orgFilter);
    if (filters.permit_status) logQuery = logQuery.eq('permits.status', filters.permit_status);
  } else {
    logQuery = supabaseAdmin
      .from('verification_logs')
      .select('created_at, verification_result, scan_type')
      .gte('created_at', since);
  }
  if (filters.scan_type) logQuery = logQuery.eq('scan_type', filters.scan_type);
  if (filters.verification_result) logQuery = logQuery.eq('verification_result', filters.verification_result);

  const { data, error } = await logQuery;
  if (error) throw new Error(error.message);
  return data || [];
}

async function getChartData(profile, query = {}) {
  const filters = parseAnalyticsFilters(query);
  const orgFilter = resolveOrgFilter(profile, filters.organisation_id);
  const days = lastNDays(filters.days);

  let permitQuery = supabaseAdmin.from('permits').select('status').neq('status', 'archived');
  if (orgFilter) permitQuery = permitQuery.eq('organisation_id', orgFilter);
  if (filters.permit_status) permitQuery = permitQuery.eq('status', filters.permit_status);
  const { data: permits } = await permitQuery;

  const statusCounts = {};
  (permits || []).forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });
  const statusOrder = ['active', 'expiring_soon', 'expired', 'revoked', 'pending_verification', 'rejected'];
  const permitStatusLabels = [];
  const permitStatusValues = [];
  statusOrder.forEach(s => {
    if (statusCounts[s]) {
      permitStatusLabels.push(s.replace(/_/g, ' '));
      permitStatusValues.push(statusCounts[s]);
    }
  });
  Object.keys(statusCounts).forEach(s => {
    if (!statusOrder.includes(s)) {
      permitStatusLabels.push(s.replace(/_/g, ' '));
      permitStatusValues.push(statusCounts[s]);
    }
  });

  const since = `${days[0]}T00:00:00.000Z`;
  const logs = await fetchVerificationLogs(filters, orgFilter, since);

  const trendMap = {};
  days.forEach(d => { trendMap[d] = { total: 0, valid: 0, failed: 0 }; });
  (logs || []).forEach(l => {
    const d = l.created_at.split('T')[0];
    if (!trendMap[d]) return;
    trendMap[d].total++;
    if (l.verification_result === 'valid' || l.verification_result === 'expiring_soon') {
      trendMap[d].valid++;
    } else {
      trendMap[d].failed++;
    }
  });

  const resultCounts = {};
  (logs || []).forEach(l => {
    const key = l.verification_result || 'unknown';
    resultCounts[key] = (resultCounts[key] || 0) + 1;
  });
  const resultLabels = Object.keys(resultCounts).map(k => k.replace(/_/g, ' '));
  const resultValues = Object.keys(resultCounts).map(k => resultCounts[k]);

  let alertQuery = supabaseAdmin.from('alerts').select('alert_type, priority');
  if (filters.alert_status && filters.alert_status !== 'all') {
    alertQuery = alertQuery.eq('status', filters.alert_status);
  }
  if (orgFilter) alertQuery = alertQuery.eq('organisation_id', orgFilter);
  const { data: alerts } = await alertQuery;
  const alertCounts = {};
  (alerts || []).forEach(a => {
    const t = (a.alert_type || 'other').replace(/_/g, ' ');
    alertCounts[t] = (alertCounts[t] || 0) + 1;
  });
  const alertLabels = Object.keys(alertCounts);
  const alertValues = Object.values(alertCounts);

  return {
    permit_status: { labels: permitStatusLabels, values: permitStatusValues },
    verification_trend: {
      labels: days.map(d => d.slice(5)),
      total: days.map(d => trendMap[d].total),
      valid: days.map(d => trendMap[d].valid),
      failed: days.map(d => trendMap[d].failed),
    },
    verification_results: { labels: resultLabels, values: resultValues },
    alerts_by_type: { labels: alertLabels, values: alertValues },
    period_days: filters.days,
    scoped_organisation_id: orgFilter,
    applied_filters: {
      organisation_id: orgFilter,
      days: filters.days,
      scan_type: filters.scan_type,
      verification_result: filters.verification_result,
      permit_status: filters.permit_status,
      alert_status: filters.alert_status,
    },
  };
}

async function getSummary(profile, query = {}) {
  const filters = parseAnalyticsFilters(query);
  const orgFilter = resolveOrgFilter(profile, filters.organisation_id);

  const countQuery = async (table, eqFilters = {}) => {
    let q = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
    if (orgFilter && ['permits', 'foreign_nationals', 'alerts', 'renewal_update_requests'].includes(table)) {
      q = q.eq('organisation_id', orgFilter);
    }
    Object.entries(eqFilters).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') q = q.eq(k, v); });
    const { count } = await q;
    return count || 0;
  };

  const permitBase = {};
  if (filters.permit_status) permitBase.status = filters.permit_status;

  const permitStatusCount = async (status) => {
    if (filters.permit_status && filters.permit_status !== status) return 0;
    return countQuery('permits', { status });
  };

  const [
    totalOrganisations, totalUsers, totalForeignNationals, totalPermits,
    activePermits, expiringPermits, expiredPermits, revokedPermits,
    pendingVerification, renewalRequests, unresolvedAlerts,
  ] = await Promise.all([
    profile.role === 'system_admin' ? countQuery('organisations', { status: 'active' }) : 0,
    profile.role === 'system_admin' ? countQuery('profiles', { status: 'active' }) : 0,
    countQuery('foreign_nationals', { status: 'active' }),
    countQuery('permits', permitBase),
    permitStatusCount('active'),
    permitStatusCount('expiring_soon'),
    permitStatusCount('expired'),
    permitStatusCount('revoked'),
    permitStatusCount('pending_verification'),
    countQuery('renewal_update_requests', { status: 'pending' }),
    countQuery('alerts', filters.alert_status === 'all' ? {} : { status: filters.alert_status || 'open' }),
  ]);

  const since = `${lastNDays(filters.days)[0]}T00:00:00.000Z`;
  const recentLogs = await fetchVerificationLogs(filters, orgFilter, since);
  const recentVerifications = recentLogs
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 200);

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
    applied_filters: {
      organisation_id: orgFilter,
      days: filters.days,
      scan_type: filters.scan_type,
      verification_result: filters.verification_result,
      permit_status: filters.permit_status,
      alert_status: filters.alert_status,
    },
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
  getAiInsights, getChartData, getFilterOptions,
};
