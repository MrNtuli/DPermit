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
