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
