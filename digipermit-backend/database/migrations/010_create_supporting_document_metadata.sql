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
