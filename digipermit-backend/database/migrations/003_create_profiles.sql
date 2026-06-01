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
