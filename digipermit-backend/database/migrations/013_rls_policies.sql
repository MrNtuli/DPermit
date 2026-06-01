-- DigiPermit Migration 013: Row Level Security Policies
-- Note: Backend uses service role key; RLS protects direct Supabase client access.

ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE foreign_nationals ENABLE ROW LEVEL SECURITY;
ALTER TABLE permit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_update_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE supporting_document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_scan_events ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's profile
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS profiles AS $$
  SELECT * FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: users can read own profile
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Notifications: own notifications only
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- Foreign nationals: self or same organisation
CREATE POLICY fn_select_scoped ON foreign_nationals
  FOR SELECT USING (
    id IN (SELECT foreign_national_id FROM profiles WHERE auth_user_id = auth.uid())
    OR organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'system_admin')
  );

-- Permits: self or same organisation
CREATE POLICY permits_select_scoped ON permits
  FOR SELECT USING (
    foreign_national_id IN (SELECT foreign_national_id FROM profiles WHERE auth_user_id = auth.uid())
    OR organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('system_admin', 'verification_officer', 'manager', 'auditor', 'immigration_officer'))
  );

-- Permit types: readable by all authenticated
CREATE POLICY permit_types_select_all ON permit_types
  FOR SELECT TO authenticated USING (true);

-- Alerts: organisation scoped
CREATE POLICY alerts_select_scoped ON alerts
  FOR SELECT USING (
    organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('system_admin', 'manager', 'auditor', 'immigration_officer'))
  );

-- Verification logs: organisation scoped or verification roles
CREATE POLICY verification_logs_select_scoped ON verification_logs
  FOR SELECT USING (
    organisation_id IN (SELECT organisation_id FROM profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('system_admin', 'verification_officer', 'manager', 'auditor', 'immigration_officer'))
  );

-- Service role bypasses RLS automatically when using service_role key from backend.
