const VALID_TYPES = [
  'employer', 'university', 'college', 'clinic', 'hospital',
  'immigration_office_simulation', 'government_department_simulation',
  'compliance_consultancy', 'other',
];

function validateOrganisationData(data) {
  const { name, organisation_type, registration_number, email } = data;

  if (!name?.trim()) throw new Error('Organisation name is required');
  if (!organisation_type || !VALID_TYPES.includes(organisation_type)) {
    throw new Error('Valid organisation type is required');
  }
  if (!registration_number?.trim()) throw new Error('Registration number is required');
  if (!email?.trim()) throw new Error('Contact email is required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new Error('Contact email is invalid');
  }

  return {
    name: name.trim(),
    organisation_type,
    registration_number: registration_number.trim(),
    email: email.trim().toLowerCase(),
    phone_number: data.phone_number?.trim() || null,
    address: data.address?.trim() || null,
    status: data.status || 'active',
  };
}

module.exports = { validateOrganisationData, VALID_TYPES };
