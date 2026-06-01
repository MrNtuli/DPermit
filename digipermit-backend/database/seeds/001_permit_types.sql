-- Seed: Permit Types
INSERT INTO permit_types (name, description, category, is_active) VALUES
  ('Visitor visa', 'Short-term visitor visa for tourism or business visits', 'visitor', true),
  ('Study visa', 'Visa for international students enrolled at educational institutions', 'study', true),
  ('Medical-treatment visa', 'Visa for foreign nationals receiving medical treatment', 'medical', true),
  ('Relative''s visa', 'Visa for relatives of residents or citizens', 'family', true),
  ('Business visa', 'Short-term business activity visa', 'business', true),
  ('General work visa', 'Standard work visa for foreign employees', 'work', true),
  ('Critical-skills work visa', 'Work visa for critical skills occupations', 'work', true),
  ('Intra-company transfer work visa', 'Transfer within multinational company', 'work', true),
  ('Corporate visa', 'Corporate-sponsored visa', 'corporate', true),
  ('Corporate-worker authorisation', 'Authorisation for corporate workers', 'corporate', true),
  ('Exchange visa', 'Cultural or academic exchange programme visa', 'exchange', true),
  ('Retired-person visa', 'Visa for retired foreign nationals', 'retirement', true),
  ('Permanent-residence permit', 'Long-term permanent residence authorisation', 'residence', true),
  ('Asylum-related documentation', 'Documentation related to asylum applications', 'asylum', true),
  ('Refugee-related documentation', 'Documentation for recognised refugees', 'refugee', true),
  ('Other immigration-related document', 'Other immigration documentation', 'other', true)
ON CONFLICT (name) DO NOTHING;
