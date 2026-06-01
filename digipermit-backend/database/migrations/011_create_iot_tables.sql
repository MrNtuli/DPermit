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
