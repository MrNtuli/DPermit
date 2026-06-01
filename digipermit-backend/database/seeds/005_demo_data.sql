-- Seed: IoT Devices
INSERT INTO iot_devices (id, organisation_id, device_name, device_type, device_identifier, status) VALUES
  ('d4000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001', 'Acme Gate RFID Reader', 'rfid_reader', 'IOT-ACME-GATE-01', 'active'),
  ('d4000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000002', 'Metro Campus QR Scanner', 'qr_scanner', 'IOT-METRO-QR-01', 'active'),
  ('d4000001-0000-4000-8000-000000000003', 'a1000001-0000-4000-8000-000000000004', 'Border Sim Checkpoint', 'rfid_reader', 'IOT-BORDER-SIM-01', 'active')
ON CONFLICT (device_identifier) DO NOTHING;

-- Seed: Alerts (sample)
INSERT INTO alerts (permit_id, foreign_national_id, organisation_id, alert_type, priority, message, status) VALUES
  ('c3000001-0000-4000-8000-000000000003', 'b2000001-0000-4000-8000-000000000006', 'a1000001-0000-4000-8000-000000000001', 'permit_expired', 'high', 'Work visa WP-2023-ACME-003 for Lukas Müller has expired.', 'open'),
  ('c3000001-0000-4000-8000-000000000002', 'b2000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000001', 'expiring_soon', 'normal', 'Critical-skills work visa WP-2024-ACME-002 expiring within 30 days.', 'open'),
  ('c3000001-0000-4000-8000-000000000006', 'b2000001-0000-4000-8000-000000000004', 'a1000001-0000-4000-8000-000000000002', 'expiring_soon', 'high', 'Study visa SV-2024-METRO-002 expiring within 14 days.', 'open'),
  ('c3000001-0000-4000-8000-000000000004', 'b2000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001', 'revoked_permit_scan', 'critical', 'Revoked permit WP-2024-ACME-004 was scanned at verification checkpoint.', 'open');

-- Seed: Renewal requests
INSERT INTO renewal_update_requests (permit_id, foreign_national_id, organisation_id, request_type, notes, new_expiry_date, status) VALUES
  ('c3000001-0000-4000-8000-000000000010', 'b2000001-0000-4000-8000-000000000001', 'a1000001-0000-4000-8000-000000000001', 'renewal_follow_up', 'Permanent residence permit renewal submitted with updated documentation.', '2030-06-01', 'pending'),
  ('c3000001-0000-4000-8000-000000000002', 'b2000001-0000-4000-8000-000000000002', 'a1000001-0000-4000-8000-000000000001', 'permit_details_update', 'Requesting update after visa renewal at embassy.', CURRENT_DATE + INTERVAL '365 days', 'pending');
