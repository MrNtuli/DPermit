-- DigiPermit Migration 001: organisations
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  organisation_type VARCHAR(50) NOT NULL CHECK (organisation_type IN (
    'employer', 'university', 'college', 'clinic', 'hospital',
    'immigration_office_simulation', 'government_department_simulation',
    'compliance_consultancy', 'other'
  )),
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  address TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organisations_status ON organisations(status);
CREATE INDEX idx_organisations_type ON organisations(organisation_type);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organisations_updated_at
  BEFORE UPDATE ON organisations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- DigiPermit Migration 002: foreign_nationals
CREATE TABLE IF NOT EXISTS foreign_nationals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_number VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  nationality VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone_number VARCHAR(50),
  current_address TEXT,
  organisation_id UUID REFERENCES organisations(id) ON DELETE RESTRICT,
  foreign_national_type VARCHAR(30) NOT NULL CHECK (foreign_national_type IN (
    'employee', 'student', 'contractor', 'visitor', 'patient', 'other'
  )),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_foreign_nationals_org ON foreign_nationals(organisation_id);
CREATE INDEX idx_foreign_nationals_status ON foreign_nationals(status);

CREATE TRIGGER foreign_nationals_updated_at
  BEFORE UPDATE ON foreign_nationals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- DigiPermit Migration 003: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE NOT NULL,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  foreign_national_id UUID REFERENCES foreign_nationals(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'system_admin', 'foreign_national', 'employer_hr', 'university_officer',
    'clinic_admin', 'verification_officer', 'immigration_officer', 'manager', 'auditor'
  )),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_auth_user ON profiles(auth_user_id);
CREATE INDEX idx_profiles_org ON profiles(organisation_id);
CREATE INDEX idx_profiles_role ON profiles(role);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- DigiPermit Migration 004: permit_types
CREATE TABLE IF NOT EXISTS permit_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER permit_types_updated_at
  BEFORE UPDATE ON permit_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- DigiPermit Migration 005: permits
CREATE TABLE IF NOT EXISTS permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_number VARCHAR(100) UNIQUE NOT NULL,
  foreign_national_id UUID NOT NULL REFERENCES foreign_nationals(id) ON DELETE RESTRICT,
  permit_type_id UUID NOT NULL REFERENCES permit_types(id) ON DELETE RESTRICT,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  passport_number VARCHAR(50) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  qr_code_value TEXT NOT NULL,
  rfid_tag VARCHAR(100),
  status VARCHAR(30) NOT NULL DEFAULT 'pending_verification' CHECK (status IN (
    'active', 'expiring_soon', 'expired', 'revoked', 'rejected',
    'pending_verification', 'renewal_in_progress', 'suspicious', 'archived'
  )),
  verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN (
    'pending', 'validated', 'rejected', 'revoked'
  )),
  captured_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  revocation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT permits_expiry_after_issue CHECK (expiry_date >= issue_date)
);

CREATE INDEX idx_permits_number ON permits(permit_number);
CREATE INDEX idx_permits_expiry ON permits(expiry_date);
CREATE INDEX idx_permits_status ON permits(status);
CREATE INDEX idx_permits_org ON permits(organisation_id);
CREATE INDEX idx_permits_fn ON permits(foreign_national_id);
CREATE INDEX idx_permits_rfid ON permits(rfid_tag);

CREATE TRIGGER permits_updated_at
  BEFORE UPDATE ON permits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- DigiPermit Migration 006: renewal_update_requests
CREATE TABLE IF NOT EXISTS renewal_update_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_id UUID NOT NULL REFERENCES permits(id) ON DELETE RESTRICT,
  foreign_national_id UUID NOT NULL REFERENCES foreign_nationals(id) ON DELETE RESTRICT,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  request_type VARCHAR(50) NOT NULL CHECK (request_type IN (
    'permit_details_update', 'supporting_document_update', 'correction_request', 'renewal_follow_up'
  )),
  notes TEXT,
  new_expiry_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'requires_changes'
  )),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_renewal_permit ON renewal_update_requests(permit_id);
CREATE INDEX idx_renewal_status ON renewal_update_requests(status);

CREATE TRIGGER renewal_update_requests_updated_at
  BEFORE UPDATE ON renewal_update_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- DigiPermit Migration 007: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permit_id UUID REFERENCES permits(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL DEFAULT 'general',
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_profile ON notifications(profile_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
-- DigiPermit Migration 008: verification_logs
CREATE TABLE IF NOT EXISTS verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_id UUID REFERENCES permits(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  scan_type VARCHAR(30) NOT NULL CHECK (scan_type IN ('manual', 'qr', 'rfid', 'camera_simulation')),
  verification_result VARCHAR(30) NOT NULL CHECK (verification_result IN (
    'valid', 'expiring_soon', 'expired', 'revoked', 'rejected',
    'pending_verification', 'renewal_in_progress', 'suspicious', 'archived', 'not_found'
  )),
  verification_note TEXT,
  device_id VARCHAR(100),
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verification_logs_permit ON verification_logs(permit_id);
CREATE INDEX idx_verification_logs_created ON verification_logs(created_at);
-- DigiPermit Migration 009: alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_id UUID REFERENCES permits(id) ON DELETE SET NULL,
  foreign_national_id UUID REFERENCES foreign_nationals(id) ON DELETE SET NULL,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  alert_type VARCHAR(80) NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'escalated')),
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_org ON alerts(organisation_id);
CREATE INDEX idx_alerts_priority ON alerts(priority);
-- DigiPermit Migration 010: supporting_document_metadata
CREATE TABLE IF NOT EXISTS supporting_document_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_id UUID NOT NULL REFERENCES permits(id) ON DELETE RESTRICT,
  foreign_national_id UUID NOT NULL REFERENCES foreign_nationals(id) ON DELETE RESTRICT,
  document_type VARCHAR(100) NOT NULL,
  file_reference VARCHAR(500) NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verification_status VARCHAR(30) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER supporting_document_metadata_updated_at
  BEFORE UPDATE ON supporting_document_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- DigiPermit Migration 011: iot_devices
CREATE TABLE IF NOT EXISTS iot_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  device_name VARCHAR(150) NOT NULL,
  device_type VARCHAR(50) NOT NULL DEFAULT 'rfid_reader',
  device_identifier VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER iot_devices_updated_at
  BEFORE UPDATE ON iot_devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DigiPermit Migration 012: iot_scan_events
CREATE TABLE IF NOT EXISTS iot_scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES iot_devices(id) ON DELETE RESTRICT,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
  scan_type VARCHAR(30) NOT NULL CHECK (scan_type IN ('manual', 'qr', 'rfid', 'camera_simulation')),
  permit_number VARCHAR(100),
  rfid_tag VARCHAR(100),
  verification_result VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_iot_scan_events_device ON iot_scan_events(device_id);
CREATE INDEX idx_iot_scan_events_created ON iot_scan_events(created_at);
-- DigiPermit Migration 013: Row Level Security Policies
-- Note: Backend uses service role key; RLS protects direct Supabase client access.

ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE foreign_nationals ENABLE ROW LEVEL SECURITY;
ALTER TABLE permit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_update_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE supporting_document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_scan_events ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's profile
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS profiles AS $$
  SELECT * FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: users can read own profile
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Notifications: own notifications only
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- Foreign nationals: self or same organisation
CREATE POLICY fn_select_scoped ON foreign_nationals
  FOR SELECT USING (
    id IN (SELECT foreign_national_id FROM profiles WHERE auth_user_id = auth.uid())
    OR organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'system_admin')
  );

-- Permits: self or same organisation
CREATE POLICY permits_select_scoped ON permits
  FOR SELECT USING (
    foreign_national_id IN (SELECT foreign_national_id FROM profiles WHERE auth_user_id = auth.uid())
    OR organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('system_admin', 'verification_officer', 'manager', 'auditor', 'immigration_officer'))
  );

-- Permit types: readable by all authenticated
CREATE POLICY permit_types_select_all ON permit_types
  FOR SELECT TO authenticated USING (true);

-- Alerts: organisation scoped
CREATE POLICY alerts_select_scoped ON alerts
  FOR SELECT USING (
    organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('system_admin', 'manager', 'auditor', 'immigration_officer'))
  );

-- Verification logs: organisation scoped or verification roles
CREATE POLICY verification_logs_select_scoped ON verification_logs
  FOR SELECT USING (
    organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('system_admin', 'verification_officer', 'manager', 'auditor', 'immigration_officer'))
  );

-- Service role bypasses RLS automatically when using service_role key from backend.
-- Analytics Views for Power BI and API

CREATE OR REPLACE VIEW vw_permit_status_summary AS
SELECT
  status,
  COUNT(*) AS permit_count
FROM permits
WHERE status != 'archived'
GROUP BY status;

CREATE OR REPLACE VIEW vw_expiring_permits AS
SELECT
  p.id,
  p.permit_number,
  p.status,
  p.expiry_date,
  (p.expiry_date - CURRENT_DATE) AS days_until_expiry,
  fn.full_name AS foreign_national_name,
  fn.nationality,
  pt.name AS permit_type,
  o.name AS organisation_name,
  o.organisation_type
FROM permits p
JOIN foreign_nationals fn ON fn.id = p.foreign_national_id
JOIN permit_types pt ON pt.id = p.permit_type_id
JOIN organisations o ON o.id = p.organisation_id
WHERE p.status NOT IN ('archived', 'revoked', 'rejected')
  AND p.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY p.expiry_date ASC;

CREATE OR REPLACE VIEW vw_verification_summary AS
SELECT
  DATE(created_at) AS verification_date,
  scan_type,
  verification_result,
  COUNT(*) AS attempt_count
FROM verification_logs
GROUP BY DATE(created_at), scan_type, verification_result
ORDER BY verification_date DESC;

CREATE OR REPLACE VIEW vw_alert_summary AS
SELECT
  alert_type,
  priority,
  status,
  COUNT(*) AS alert_count
FROM alerts
GROUP BY alert_type, priority, status;

CREATE OR REPLACE VIEW vw_employer_compliance AS
SELECT
  o.id AS organisation_id,
  o.name AS organisation_name,
  COUNT(DISTINCT fn.id) AS total_foreign_nationals,
  COUNT(p.id) FILTER (WHERE p.status = 'active') AS active_permits,
  COUNT(p.id) FILTER (WHERE p.status = 'expiring_soon') AS expiring_soon,
  COUNT(p.id) FILTER (WHERE p.status = 'expired') AS expired_permits,
  COUNT(p.id) FILTER (WHERE p.status = 'revoked') AS revoked_permits
FROM organisations o
LEFT JOIN foreign_nationals fn ON fn.organisation_id = o.id AND fn.status = 'active'
LEFT JOIN permits p ON p.organisation_id = o.id AND p.status != 'archived'
WHERE o.organisation_type = 'employer'
GROUP BY o.id, o.name;

CREATE OR REPLACE VIEW vw_university_compliance AS
SELECT
  o.id AS organisation_id,
  o.name AS organisation_name,
  COUNT(DISTINCT fn.id) FILTER (WHERE fn.foreign_national_type = 'student') AS total_students,
  COUNT(p.id) FILTER (WHERE p.status = 'active') AS active_study_visas,
  COUNT(p.id) FILTER (WHERE p.status = 'expiring_soon') AS expiring_soon,
  COUNT(p.id) FILTER (WHERE p.status = 'expired') AS expired_study_visas
FROM organisations o
LEFT JOIN foreign_nationals fn ON fn.organisation_id = o.id AND fn.status = 'active'
LEFT JOIN permits p ON p.organisation_id = o.id AND p.status != 'archived'
WHERE o.organisation_type IN ('university', 'college')
GROUP BY o.id, o.name;

CREATE OR REPLACE VIEW vw_iot_scan_summary AS
SELECT
  DATE(e.created_at) AS scan_date,
  d.device_name,
  e.scan_type,
  e.verification_result,
  COUNT(*) AS scan_count
FROM iot_scan_events e
JOIN iot_devices d ON d.id = e.device_id
GROUP BY DATE(e.created_at), d.device_name, e.scan_type, e.verification_result
ORDER BY scan_date DESC;
-- Seed: Permit Types
INSERT INTO permit_types (name, description, category, is_active) VALUES
  ('Visitor visa', 'Short-term visitor visa for tourism or business visits', 'visitor', true),
  ('Study visa', 'Visa for international students enrolled at educational institutions', 'study', true),
  ('Medical-treatment visa', 'Visa for foreign nationals receiving medical treatment', 'medical', true),
  ('Relative''s visa', 'Visa for relatives of residents or citizens', 'family', true),
  ('Business visa', 'Short-term business activity visa', 'business', true),
  ('General work visa', 'Standard work visa for foreign employees', 'work', true),
  ('Critical-skills work visa', 'Work visa for critical skills occupations', 'work', true),
  ('Intra-company transfer work visa', 'Transfer within multinational company', 'work', true),
  ('Corporate visa', 'Corporate-sponsored visa', 'corporate', true),
  ('Corporate-worker authorisation', 'Authorisation for corporate workers', 'corporate', true),
  ('Exchange visa', 'Cultural or academic exchange programme visa', 'exchange', true),
  ('Retired-person visa', 'Visa for retired foreign nationals', 'retirement', true),
  ('Permanent-residence permit', 'Long-term permanent residence authorisation', 'residence', true),
  ('Asylum-related documentation', 'Documentation related to asylum applications', 'asylum', true),
  ('Refugee-related documentation', 'Documentation for recognised refugees', 'refugee', true),
  ('Other immigration-related document', 'Other immigration documentation', 'other', true)
ON CONFLICT (name) DO NOTHING;
-- Seed: Organisations (fixed UUIDs for referential seeding)
INSERT INTO organisations (id, name, organisation_type, registration_number, email, phone_number, address, status) VALUES
  ('a1000001-0000-4000-8000-000000000001', 'Acme Global Industries (Pty) Ltd', 'employer', 'EMP-2024-001', 'hr@acmeglobal.demo', '+27 11 555 0101', '100 Industrial Road, Johannesburg', 'active'),
  ('a1000001-0000-4000-8000-000000000002', 'Metro University of Technology', 'university', 'UNI-2024-001', 'international@metrouni.demo', '+27 21 555 0202', '50 Campus Drive, Cape Town', 'active'),
  ('a1000001-0000-4000-8000-000000000003', 'City Wellness Clinic', 'clinic', 'CLI-2024-001', 'admin@citywellness.demo', '+27 31 555 0303', '22 Health Street, Durban', 'active'),
  ('a1000001-0000-4000-8000-000000000004', 'DigiPermit Immigration Office Simulation', 'immigration_office_simulation', 'IMM-SIM-001', 'compliance@digipermit.demo', '+27 12 555 0404', '1 Compliance Avenue, Pretoria', 'active'),
  ('a1000001-0000-4000-8000-000000000005', 'National Compliance Consultancy', 'compliance_consultancy', 'CON-2024-001', 'audit@natcompliance.demo', '+27 11 555 0505', '88 Audit Lane, Sandton', 'active')
ON CONFLICT (registration_number) DO NOTHING;
-- Seed: Foreign Nationals
INSERT INTO foreign_nationals (id, passport_number, full_name, date_of_birth, nationality, email, phone_number, current_address, organisation_id, foreign_national_type, status) VALUES
  ('b2000001-0000-4000-8000-000000000001', 'FN88291034', 'James Okonkwo', '1990-03-15', 'Nigerian', 'james.okonkwo@demo.mail', '+27 82 100 0001', '45 Worker Street, Johannesburg', 'a1000001-0000-4000-8000-000000000001', 'employee', 'active'),
  ('b2000001-0000-4000-8000-000000000002', 'FN77382910', 'Priya Sharma', '1988-07-22', 'Indian', 'priya.sharma@demo.mail', '+27 82 100 0002', '12 Tech Park, Johannesburg', 'a1000001-0000-4000-8000-000000000001', 'employee', 'active'),
  ('b2000001-0000-4000-8000-000000000003', 'FN66473829', 'Maria Santos', '2001-11-08', 'Brazilian', 'maria.santos@demo.mail', '+27 83 200 0003', 'Student Res Block A, Cape Town', 'a1000001-0000-4000-8000-000000000002', 'student', 'active'),
  ('b2000001-0000-4000-8000-000000000004', 'FN55564738', 'Chen Wei', '2000-05-30', 'Chinese', 'chen.wei@demo.mail', '+27 83 200 0004', 'Student Res Block B, Cape Town', 'a1000001-0000-4000-8000-000000000002', 'student', 'active'),
  ('b2000001-0000-4000-8000-000000000005', 'FN44655647', 'Ahmed Hassan', '1975-09-12', 'Egyptian', 'ahmed.hassan@demo.mail', '+27 84 300 0005', 'Clinic Ward 3, Durban', 'a1000001-0000-4000-8000-000000000003', 'patient', 'active'),
  ('b2000001-0000-4000-8000-000000000006', 'FN33746556', 'Lukas MÃ¼ller', '1992-01-25', 'German', 'lukas.muller@demo.mail', '+27 85 400 0006', 'Contractor Site Office, Pretoria', 'a1000001-0000-4000-8000-000000000001', 'contractor', 'active'),
  ('b2000001-0000-4000-8000-000000000007', 'FN22837465', 'Sofia Petrov', '1995-12-03', 'Bulgarian', 'sofia.petrov@demo.mail', '+27 86 500 0007', 'Guest House 7, Cape Town', 'a1000001-0000-4000-8000-000000000002', 'visitor', 'active')
ON CONFLICT (passport_number) DO NOTHING;
-- Seed: Permits (various statuses for demo)
-- QR values format: DIGIPERMIT:{permit_number}
INSERT INTO permits (id, permit_number, foreign_national_id, permit_type_id, organisation_id, passport_number, issue_date, expiry_date, qr_code_value, rfid_tag, status, verification_status) VALUES
  ('c3000001-0000-4000-8000-000000000001', 'WP-2024-ACME-001',
    'b2000001-0000-4000-8000-000000000001',
    (SELECT id FROM permit_types WHERE name = 'General work visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000001', 'FN88291034',
    '2024-01-15', '2026-06-15', 'DIGIPERMIT:WP-2024-ACME-001', 'RFID-ACME-001', 'active', 'validated'),

  ('c3000001-0000-4000-8000-000000000002', 'WP-2024-ACME-002',
    'b2000001-0000-4000-8000-000000000002',
    (SELECT id FROM permit_types WHERE name = 'Critical-skills work visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000001', 'FN77382910',
    '2024-03-01', CURRENT_DATE + INTERVAL '25 days', 'DIGIPERMIT:WP-2024-ACME-002', 'RFID-ACME-002', 'expiring_soon', 'validated'),

  ('c3000001-0000-4000-8000-000000000003', 'WP-2023-ACME-003',
    'b2000001-0000-4000-8000-000000000006',
    (SELECT id FROM permit_types WHERE name = 'General work visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000001', 'FN33746556',
    '2023-06-01', '2025-01-01', 'DIGIPERMIT:WP-2023-ACME-003', 'RFID-ACME-003', 'expired', 'validated'),

  ('c3000001-0000-4000-8000-000000000004', 'WP-2024-ACME-004',
    'b2000001-0000-4000-8000-000000000001',
    (SELECT id FROM permit_types WHERE name = 'General work visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000001', 'FN88291034',
    '2023-01-01', '2024-06-01', 'DIGIPERMIT:WP-2024-ACME-004', 'RFID-ACME-004', 'revoked', 'revoked'),

  ('c3000001-0000-4000-8000-000000000005', 'SV-2024-METRO-001',
    'b2000001-0000-4000-8000-000000000003',
    (SELECT id FROM permit_types WHERE name = 'Study visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000002', 'FN66473829',
    '2024-02-01', '2027-02-01', 'DIGIPERMIT:SV-2024-METRO-001', 'RFID-METRO-001', 'active', 'validated'),

  ('c3000001-0000-4000-8000-000000000006', 'SV-2024-METRO-002',
    'b2000001-0000-4000-8000-000000000004',
    (SELECT id FROM permit_types WHERE name = 'Study visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000002', 'FN55564738',
    '2024-02-01', CURRENT_DATE + INTERVAL '10 days', 'DIGIPERMIT:SV-2024-METRO-002', 'RFID-METRO-002', 'expiring_soon', 'validated'),

  ('c3000001-0000-4000-8000-000000000007', 'VV-2024-METRO-001',
    'b2000001-0000-4000-8000-000000000007',
    (SELECT id FROM permit_types WHERE name = 'Visitor visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000002', 'FN22837465',
    '2025-01-01', '2025-12-31', 'DIGIPERMIT:VV-2024-METRO-001', 'RFID-METRO-003', 'active', 'validated'),

  ('c3000001-0000-4000-8000-000000000008', 'MT-2024-CLINIC-001',
    'b2000001-0000-4000-8000-000000000005',
    (SELECT id FROM permit_types WHERE name = 'Medical-treatment visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000003', 'FN44655647',
    '2024-08-01', '2025-08-01', 'DIGIPERMIT:MT-2024-CLINIC-001', 'RFID-CLINIC-001', 'pending_verification', 'pending'),

  ('c3000001-0000-4000-8000-000000000009', 'WP-2025-ACME-005',
    'b2000001-0000-4000-8000-000000000002',
    (SELECT id FROM permit_types WHERE name = 'General work visa' LIMIT 1),
    'a1000001-0000-4000-8000-000000000001', 'FN77382910',
    '2025-01-01', '2025-06-01', 'DIGIPERMIT:WP-2025-ACME-005', 'RFID-ACME-005', 'rejected', 'rejected'),

  ('c3000001-0000-4000-8000-000000000010', 'PR-2024-ACME-001',
    'b2000001-0000-4000-8000-000000000001',
    (SELECT id FROM permit_types WHERE name = 'Permanent-residence permit' LIMIT 1),
    'a1000001-0000-4000-8000-000000000001', 'FN88291034',
    '2024-06-01', '2029-06-01', 'DIGIPERMIT:PR-2024-ACME-001', 'RFID-ACME-PR1', 'renewal_in_progress', 'validated')
ON CONFLICT (permit_number) DO NOTHING;
-- Seed: IoT Devices
INSERT INTO iot_devices (id, organisation_id, device_name, device_type, device_identifier, status) VALUES
  ('d4000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001', 'Acme Gate RFID Reader', 'rfid_reader', 'IOT-ACME-GATE-01', 'active'),
  ('d4000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000002', 'Metro Campus QR Scanner', 'qr_scanner', 'IOT-METRO-QR-01', 'active'),
  ('d4000001-0000-4000-8000-000000000003', 'a1000001-0000-4000-8000-000000000004', 'Border Sim Checkpoint', 'rfid_reader', 'IOT-BORDER-SIM-01', 'active')
ON CONFLICT (device_identifier) DO NOTHING;

-- Seed: Alerts (sample)
INSERT INTO alerts (permit_id, foreign_national_id, organisation_id, alert_type, priority, message, status) VALUES
  ('c3000001-0000-4000-8000-000000000003', 'b2000001-0000-4000-8000-000000000006', 'a1000001-0000-4000-8000-000000000001', 'permit_expired', 'high', 'Work visa WP-2023-ACME-003 for Lukas MÃ¼ller has expired.', 'open'),
  ('c3000001-0000-4000-8000-000000000002', 'b2000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000001', 'expiring_soon', 'normal', 'Critical-skills work visa WP-2024-ACME-002 expiring within 30 days.', 'open'),
  ('c3000001-0000-4000-8000-000000000006', 'b2000001-0000-4000-8000-000000000004', 'a1000001-0000-4000-8000-000000000002', 'expiring_soon', 'high', 'Study visa SV-2024-METRO-002 expiring within 14 days.', 'open'),
  ('c3000001-0000-4000-8000-000000000004', 'b2000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001', 'revoked_permit_scan', 'critical', 'Revoked permit WP-2024-ACME-004 was scanned at verification checkpoint.', 'open');

-- Seed: Renewal requests
INSERT INTO renewal_update_requests (permit_id, foreign_national_id, organisation_id, request_type, notes, new_expiry_date, status) VALUES
  ('c3000001-0000-4000-8000-000000000010', 'b2000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001', 'renewal_follow_up', 'Permanent residence permit renewal submitted with updated documentation.', '2030-06-01', 'pending'),
  ('c3000001-0000-4000-8000-000000000002', 'b2000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000001', 'permit_details_update', 'Requesting update after visa renewal at embassy.', CURRENT_DATE + INTERVAL '365 days', 'pending');
