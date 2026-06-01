const { supabaseAdmin, supabaseAnon } = require('../config/supabase');

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

module.exports = { signup, login, logout, getProfile };
