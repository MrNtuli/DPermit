export interface UserProfile {
  id: string;
  auth_user_id: string;
  organisation_id?: string;
  foreign_national_id?: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: string;
  status: string;
  organisations?: { id: string; name: string; organisation_type: string };
  foreign_nationals?: { id: string; full_name: string; passport_number: string };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface Permit {
  id: string;
  permit_number: string;
  foreign_national_id: string;
  permit_type_id: string;
  organisation_id: string;
  passport_number: string;
  issue_date: string;
  expiry_date: string;
  qr_code_value: string;
  rfid_tag?: string;
  status: string;
  verification_status: string;
  permit_types?: { id: string; name: string; category: string };
  foreign_nationals?: { id: string; full_name: string; nationality: string };
  organisations?: { id: string; name: string };
}

export interface ChartDataset {
  labels: string[];
  values: number[];
}

export interface AnalyticsFilters {
  organisation_id?: string | null;
  days?: number;
  scan_type?: string | null;
  verification_result?: string | null;
  permit_status?: string | null;
  alert_status?: string | null;
}

export interface AnalyticsFilterOptions {
  can_filter_organisation: boolean;
  can_view_permit_charts?: boolean;
  can_view_alert_charts?: boolean;
  role_scope?: 'platform' | 'organisation' | 'checkpoint' | 'self';
  organisations: { id: string; name: string; organisation_type: string }[];
  periods: { value: number; label: string }[];
  scan_types: { value: string; label: string }[];
  verification_results: { value: string; label: string }[];
  permit_statuses: { value: string; label: string }[];
  alert_statuses: { value: string; label: string }[];
}

export interface DashboardChartData {
  permit_status: ChartDataset;
  verification_trend: {
    labels: string[];
    total: number[];
    valid: number[];
    failed: number[];
  };
  verification_results: ChartDataset;
  alerts_by_type: ChartDataset;
  period_days: number;
  scoped_organisation_id?: string | null;
  applied_filters?: AnalyticsFilters;
}

export interface Organisation {
  id: string;
  name: string;
  organisation_type: string;
  registration_number: string;
  email: string;
  phone_number?: string;
  address?: string;
  status: string;
}

export interface ForeignNational {
  id: string;
  passport_number: string;
  full_name: string;
  date_of_birth?: string;
  nationality: string;
  email?: string;
  phone_number?: string;
  foreign_national_type: string;
  organisation_id: string;
  status: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  permits?: { permit_number: string };
}

export interface Alert {
  id: string;
  alert_type: string;
  priority: string;
  message: string;
  status: string;
  created_at: string;
  permits?: { permit_number: string };
}

export interface VerificationResult {
  foreign_national_name?: string;
  masked_passport_number?: string;
  permit_number?: string;
  permit_type?: string;
  organisation?: string;
  issue_date?: string;
  expiry_date?: string;
  permit_status?: string;
  verification_result: string;
  scan_type: string;
  timestamp: string;
  warning_message?: string;
  days_until_expiry?: number;
}

export const ROLE_LABELS: Record<string, string> = {
  system_admin: 'System Administrator',
  foreign_national: 'Foreign National',
  employer_hr: 'Employer HR Officer',
  university_officer: 'University Officer',
  clinic_admin: 'Clinic Administrator',
  verification_officer: 'Verification Officer',
  immigration_officer: 'Immigration Officer',
  manager: 'Manager / Auditor',
  auditor: 'Auditor',
};

/** Roles that must be linked to an organisation when provisioned by admin. */
export const ORG_REQUIRED_ROLES = ['employer_hr', 'university_officer', 'clinic_admin', 'foreign_national'];

export const ORGANISATION_TYPE_LABELS: Record<string, string> = {
  employer: 'Employer',
  university: 'University',
  college: 'College',
  clinic: 'Clinic',
  hospital: 'Hospital',
  immigration_office_simulation: 'Immigration Office (Simulation)',
  government_department_simulation: 'Government Department (Simulation)',
  compliance_consultancy: 'Compliance Consultancy',
  other: 'Other',
};

export const ORGANISATION_TYPE_OPTIONS = Object.entries(ORGANISATION_TYPE_LABELS)
  .map(([value, label]) => ({ value, label }));

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

export const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  FOREIGN_NATIONAL: 'foreign_national',
  EMPLOYER_HR: 'employer_hr',
  UNIVERSITY_OFFICER: 'university_officer',
  CLINIC_ADMIN: 'clinic_admin',
  VERIFICATION_OFFICER: 'verification_officer',
  IMMIGRATION_OFFICER: 'immigration_officer',
  MANAGER: 'manager',
  AUDITOR: 'auditor',
};

export const ROLE_DASHBOARD: Record<string, string> = {
  system_admin: '/admin/dashboard',
  foreign_national: '/foreign-national/dashboard',
  employer_hr: '/employer/dashboard',
  university_officer: '/university/dashboard',
  clinic_admin: '/clinic/dashboard',
  verification_officer: '/verification/dashboard',
  immigration_officer: '/immigration/dashboard',
  manager: '/manager/dashboard',
  auditor: '/manager/dashboard',
};
