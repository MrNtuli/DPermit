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
