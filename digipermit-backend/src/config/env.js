require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  frontendUrls: (process.env.FRONTEND_URL || 'http://localhost:4200,http://localhost:8100')
    .split(',').map(s => s.trim()),
  expiryThresholds: (process.env.EXPIRY_THRESHOLDS || '90,60,30,14,7,1,0')
    .split(',').map(Number).filter(n => !isNaN(n)),
  maxScansPerHour: parseInt(process.env.MAX_SCANS_PER_HOUR || '10', 10),
  maxInvalidAttempts: parseInt(process.env.MAX_INVALID_ATTEMPTS || '5', 10),
};
