const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

if (!env.supabaseUrl || !env.supabaseServiceKey) {
  console.warn('Warning: Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

const supabaseAdmin = createClient(env.supabaseUrl || '', env.supabaseServiceKey || '', {
  auth: { autoRefreshToken: false, persistSession: false },
});

const supabaseAnon = createClient(env.supabaseUrl || '', env.supabaseAnonKey || '', {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabaseAdmin, supabaseAnon };
