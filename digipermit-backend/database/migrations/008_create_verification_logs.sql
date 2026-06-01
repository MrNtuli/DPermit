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
