const { supabaseAdmin } = require('../config/supabase');
const { error } = require('../utils/apiResponse');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return error(res, 'Invalid or expired token', 401);
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (profileError || !profile) {
      return error(res, 'User profile not found', 403);
    }

    if (profile.status !== 'active') {
      return error(res, 'Account is inactive', 403);
    }

    req.user = user;
    req.profile = profile;
    req.token = token;
    next();
  } catch (err) {
    return error(res, 'Authentication failed', 401);
  }
}

module.exports = authMiddleware;
