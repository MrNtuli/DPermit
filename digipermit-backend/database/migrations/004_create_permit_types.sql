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
