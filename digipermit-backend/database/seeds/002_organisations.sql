-- Seed: Organisations (fixed UUIDs for referential seeding)
INSERT INTO organisations (id, name, organisation_type, registration_number, email, phone_number, address, status) VALUES
  ('a1000001-0000-4000-8000-000000000001', 'Acme Global Industries (Pty) Ltd', 'employer', 'EMP-2024-001', 'hr@acmeglobal.demo', '+27 11 555 0101', '100 Industrial Road, Johannesburg', 'active'),
  ('a1000001-0000-4000-8000-000000000002', 'Metro University of Technology', 'university', 'UNI-2024-001', 'international@metrouni.demo', '+27 21 555 0202', '50 Campus Drive, Cape Town', 'active'),
  ('a1000001-0000-4000-8000-000000000003', 'City Wellness Clinic', 'clinic', 'CLI-2024-001', 'admin@citywellness.demo', '+27 31 555 0303', '22 Health Street, Durban', 'active'),
  ('a1000001-0000-4000-8000-000000000004', 'DigiPermit Immigration Office Simulation', 'immigration_office_simulation', 'IMM-SIM-001', 'compliance@digipermit.demo', '+27 12 555 0404', '1 Compliance Avenue, Pretoria', 'active'),
  ('a1000001-0000-4000-8000-000000000005', 'National Compliance Consultancy', 'compliance_consultancy', 'CON-2024-001', 'audit@natcompliance.demo', '+27 11 555 0505', '88 Audit Lane, Sandton', 'active')
ON CONFLICT (registration_number) DO NOTHING;
