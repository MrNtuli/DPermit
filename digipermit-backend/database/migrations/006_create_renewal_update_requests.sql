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
