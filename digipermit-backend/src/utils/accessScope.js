/** Central data-access scopes for API queries and analytics. */

const PLATFORM_WIDE_ROLES = [
  'system_admin',
  'immigration_officer',
  'manager',
  'auditor',
];

const ORGANISATION_SCOPED_ROLES = [
  'employer_hr',
  'university_officer',
  'clinic_admin',
];

const CHECKPOINT_ROLES = ['verification_officer'];

const SELF_SCOPED_ROLES = ['foreign_national'];

function isPlatformWide(role) {
  return PLATFORM_WIDE_ROLES.includes(role);
}

function isOrganisationScoped(role) {
  return ORGANISATION_SCOPED_ROLES.includes(role);
}

function isCheckpointRole(role) {
  return CHECKPOINT_ROLES.includes(role);
}

function isSelfScoped(role) {
  return SELF_SCOPED_ROLES.includes(role);
}

/** Organisation id filter for list/analytics queries (null = platform-wide). */
function organisationFilterFor(profile) {
  if (isPlatformWide(profile.role)) return null;
  if (isCheckpointRole(profile.role)) return null;
  if (isSelfScoped(profile.role)) return null;
  return profile.organisation_id || null;
}

/** Whether user may pick any employer/uni/clinic org in analytics filters. */
function canSelectOrganisationInAnalytics(profile) {
  return isPlatformWide(profile.role);
}

/** Whether analytics includes permit inventory charts (not checkpoint-only). */
function canViewPermitInventoryAnalytics(profile) {
  return !isCheckpointRole(profile.role);
}

/** Whether analytics includes alert breakdown charts. */
function canViewAlertAnalytics(profile) {
  return isPlatformWide(profile.role) || isOrganisationScoped(profile.role);
}

function canListAllPermits(profile) {
  return isPlatformWide(profile.role);
}

function canAccessOrganisationData(profile, organisationId) {
  if (profile.role === 'system_admin') return true;
  if (isPlatformWide(profile.role)) return true;
  if (isCheckpointRole(profile.role)) return false;
  if (isSelfScoped(profile.role)) return profile.organisation_id === organisationId;
  return profile.organisation_id === organisationId;
}

module.exports = {
  PLATFORM_WIDE_ROLES,
  ORGANISATION_SCOPED_ROLES,
  CHECKPOINT_ROLES,
  SELF_SCOPED_ROLES,
  isPlatformWide,
  isOrganisationScoped,
  isCheckpointRole,
  isSelfScoped,
  organisationFilterFor,
  canSelectOrganisationInAnalytics,
  canViewPermitInventoryAnalytics,
  canViewAlertAnalytics,
  canListAllPermits,
  canAccessOrganisationData,
};
