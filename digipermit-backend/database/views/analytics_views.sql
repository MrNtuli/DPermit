-- Analytics Views for Power BI and API

CREATE OR REPLACE VIEW vw_permit_status_summary AS
SELECT
  status,
  COUNT(*) AS permit_count
FROM permits
WHERE status != 'archived'
GROUP BY status;

CREATE OR REPLACE VIEW vw_expiring_permits AS
SELECT
  p.id,
  p.permit_number,
  p.status,
  p.expiry_date,
  (p.expiry_date - CURRENT_DATE) AS days_until_expiry,
  fn.full_name AS foreign_national_name,
  fn.nationality,
  pt.name AS permit_type,
  o.name AS organisation_name,
  o.organisation_type
FROM permits p
JOIN foreign_nationals fn ON fn.id = p.foreign_national_id
JOIN permit_types pt ON pt.id = p.permit_type_id
JOIN organisations o ON o.id = p.organisation_id
WHERE p.status NOT IN ('archived', 'revoked', 'rejected')
  AND p.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY p.expiry_date ASC;

CREATE OR REPLACE VIEW vw_verification_summary AS
SELECT
  DATE(created_at) AS verification_date,
  scan_type,
  verification_result,
  COUNT(*) AS attempt_count
FROM verification_logs
GROUP BY DATE(created_at), scan_type, verification_result
ORDER BY verification_date DESC;

CREATE OR REPLACE VIEW vw_alert_summary AS
SELECT
  alert_type,
  priority,
  status,
  COUNT(*) AS alert_count
FROM alerts
GROUP BY alert_type, priority, status;

CREATE OR REPLACE VIEW vw_employer_compliance AS
SELECT
  o.id AS organisation_id,
  o.name AS organisation_name,
  COUNT(DISTINCT fn.id) AS total_foreign_nationals,
  COUNT(p.id) FILTER (WHERE p.status = 'active') AS active_permits,
  COUNT(p.id) FILTER (WHERE p.status = 'expiring_soon') AS expiring_soon,
  COUNT(p.id) FILTER (WHERE p.status = 'expired') AS expired_permits,
  COUNT(p.id) FILTER (WHERE p.status = 'revoked') AS revoked_permits
FROM organisations o
LEFT JOIN foreign_nationals fn ON fn.organisation_id = o.id AND fn.status = 'active'
LEFT JOIN permits p ON p.organisation_id = o.id AND p.status != 'archived'
WHERE o.organisation_type = 'employer'
GROUP BY o.id, o.name;

CREATE OR REPLACE VIEW vw_university_compliance AS
SELECT
  o.id AS organisation_id,
  o.name AS organisation_name,
  COUNT(DISTINCT fn.id) FILTER (WHERE fn.foreign_national_type = 'student') AS total_students,
  COUNT(p.id) FILTER (WHERE p.status = 'active') AS active_study_visas,
  COUNT(p.id) FILTER (WHERE p.status = 'expiring_soon') AS expiring_soon,
  COUNT(p.id) FILTER (WHERE p.status = 'expired') AS expired_study_visas
FROM organisations o
LEFT JOIN foreign_nationals fn ON fn.organisation_id = o.id AND fn.status = 'active'
LEFT JOIN permits p ON p.organisation_id = o.id AND p.status != 'archived'
WHERE o.organisation_type IN ('university', 'college')
GROUP BY o.id, o.name;

CREATE OR REPLACE VIEW vw_iot_scan_summary AS
SELECT
  DATE(e.created_at) AS scan_date,
  d.device_name,
  e.scan_type,
  e.verification_result,
  COUNT(*) AS scan_count
FROM iot_scan_events e
JOIN iot_devices d ON d.id = e.device_id
GROUP BY DATE(e.created_at), d.device_name, e.scan_type, e.verification_result
ORDER BY scan_date DESC;
