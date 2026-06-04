const { supabaseAdmin, supabaseAnon } = require('../config/supabase');
const env = require('../config/env');
const { assertPasswordStrength } = require('../utils/passwordValidation');

function getPasswordResetRedirectUrl() {
  const base = (env.frontendUrls[0] || 'http://localhost:4200').replace(/\/$/, '');
  return `${base}/reset-password`;
}

async function signup({ email, password, full_name, role, organisation_id, phone_number, foreign_national_id }) {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw new Error(authError.message);

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      auth_user_id: authData.user.id,
      full_name,
      email,
      phone_number,
      role: role || 'foreign_national',
      organisation_id: organisation_id || null,
      foreign_national_id: foreign_national_id || null,
      status: 'active',
    })
    .select()
    .single();

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw new Error(profileError.message);
  }

  return { user: authData.user, profile };
}

async function login(email, password) {
  const { data, error: loginError } = await supabaseAnon.auth.signInWithPassword({ email, password });
  if (loginError) throw new Error(loginError.message);

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*, organisations(id, name, organisation_type)')
    .eq('auth_user_id', data.user.id)
    .single();

  if (profileError) throw new Error('Profile not found');

  return {
    session: data.session,
    user: data.user,
    profile,
  };
}

async function logout(token) {
  await supabaseAnon.auth.signOut();
  return true;
}

async function getProfile(authUserId) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*, organisations(id, name, organisation_type), foreign_nationals(id, full_name, passport_number)')
    .eq('auth_user_id', authUserId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Sends Supabase recovery email when the address is registered. */
async function requestPasswordReset(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) throw new Error('Email is required');

  const redirectTo = getPasswordResetRedirectUrl();
  const { error } = await supabaseAnon.auth.resetPasswordForEmail(normalized, { redirectTo });
  if (error) {
    console.warn('Password reset email:', error.message);
  }

  return {
    message: 'If an account exists for this email, a password reset link has been sent.',
  };
}

/** Completes recovery using the access_token from the email link hash. */
async function completePasswordReset(access_token, new_password) {
  assertPasswordStrength(new_password);
  if (!access_token) throw new Error('Reset token is required');

  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(access_token);
  if (userError || !user) {
    throw new Error('Invalid or expired reset link. Request a new reset email.');
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password: new_password });
  if (error) throw new Error(error.message);
  return true;
}

/** Logged-in user changes password after verifying the current one. */
async function changePassword(authUserId, email, current_password, new_password) {
  assertPasswordStrength(new_password);
  if (!current_password) throw new Error('Current password is required');
  if (current_password === new_password) {
    throw new Error('New password must be different from your current password');
  }

  const { error: verifyError } = await supabaseAnon.auth.signInWithPassword({
    email: String(email).trim().toLowerCase(),
    password: current_password,
  });
  if (verifyError) throw new Error('Current password is incorrect');

  const { error } = await supabaseAdmin.auth.admin.updateUserById(authUserId, { password: new_password });
  if (error) throw new Error(error.message);
  return true;
}

module.exports = {
  signup,
  login,
  logout,
  getProfile,
  requestPasswordReset,
  completePasswordReset,
  changePassword,
};
