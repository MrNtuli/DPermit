-- Seed: Foreign Nationals
INSERT INTO foreign_nationals (id, passport_number, full_name, date_of_birth, nationality, email, phone_number, current_address, organisation_id, foreign_national_type, status) VALUES
  ('b2000001-0000-4000-8000-000000000001', 'FN88291034', 'James Okonkwo', '1990-03-15', 'Nigerian', 'james.okonkwo@demo.mail', '+27 82 100 0001', '45 Worker Street, Johannesburg', 'a1000001-0000-4000-8000-000000000001', 'employee', 'active'),
  ('b2000001-0000-4000-8000-000000000002', 'FN77382910', 'Priya Sharma', '1988-07-22', 'Indian', 'priya.sharma@demo.mail', '+27 82 100 0002', '12 Tech Park, Johannesburg', 'a1000001-0000-4000-8000-000000000001', 'employee', 'active'),
  ('b2000001-0000-4000-8000-000000000003', 'FN66473829', 'Maria Santos', '2001-11-08', 'Brazilian', 'maria.santos@demo.mail', '+27 83 200 0003', 'Student Res Block A, Cape Town', 'a1000001-0000-4000-8000-000000000002', 'student', 'active'),
  ('b2000001-0000-4000-8000-000000000004', 'FN55564738', 'Chen Wei', '2000-05-30', 'Chinese', 'chen.wei@demo.mail', '+27 83 200 0004', 'Student Res Block B, Cape Town', 'a1000001-0000-4000-8000-000000000002', 'student', 'active'),
  ('b2000001-0000-4000-8000-000000000005', 'FN44655647', 'Ahmed Hassan', '1975-09-12', 'Egyptian', 'ahmed.hassan@demo.mail', '+27 84 300 0005', 'Clinic Ward 3, Durban', 'a1000001-0000-4000-8000-000000000003', 'patient', 'active'),
  ('b2000001-0000-4000-8000-000000000006', 'FN33746556', 'Lukas Müller', '1992-01-25', 'German', 'lukas.muller@demo.mail', '+27 85 400 0006', 'Contractor Site Office, Pretoria', 'a1000001-0000-4000-8000-000000000001', 'contractor', 'active'),
  ('b2000001-0000-4000-8000-000000000007', 'FN22837465', 'Sofia Petrov', '1995-12-03', 'Bulgarian', 'sofia.petrov@demo.mail', '+27 86 500 0007', 'Guest House 7, Cape Town', 'a1000001-0000-4000-8000-000000000002', 'visitor', 'active')
ON CONFLICT (passport_number) DO NOTHING;
