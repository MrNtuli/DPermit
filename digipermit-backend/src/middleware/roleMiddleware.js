const { error } = require('../utils/apiResponse');

const ALL_ROLES = [
  'system_admin', 'foreign_national', 'employer_hr', 'university_officer',
  'clinic_admin', 'verification_officer', 'immigration_officer', 'manager', 'auditor',
];

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.profile) {
      return error(res, 'Authentication required', 401);
    }
    if (req.profile.role === 'system_admin') {
      return next();
    }
    if (allowedRoles.includes(req.profile.role)) {
      return next();
    }
    return error(res, 'Access denied: insufficient permissions', 403);
  };
}

function isReadOnlyRole(role) {
  return ['manager', 'auditor'].includes(role);
}

function canAccessOrganisation(profile, organisationId) {
  if (profile.role === 'system_admin') return true;
  if (['manager', 'auditor', 'verification_officer', 'immigration_officer'].includes(profile.role)) return true;
  return profile.organisation_id === organisationId;
}

function canAccessForeignNational(profile, foreignNationalId) {
  if (profile.role === 'system_admin') return true;
  if (profile.foreign_national_id === foreignNationalId) return true;
  return false;
}

module.exports = { authorize, isReadOnlyRole, canAccessOrganisation, canAccessForeignNational, ALL_ROLES };
