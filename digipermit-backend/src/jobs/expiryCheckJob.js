const { supabaseAdmin } = require('../config/supabase');
const env = require('../config/env');
const { daysUntilExpiry, computePermitStatus } = require('../utils/expiryCalculator');
const notificationService = require('../services/notificationService');
const alertService = require('../services/alertService');

async function runExpiryCheck() {
  console.log('[ExpiryJob] Starting daily expiry check...');

  const { data: permits, error } = await supabaseAdmin
    .from('permits')
    .select('*, foreign_nationals(id, full_name)')
    .not('status', 'in', '("archived","revoked","rejected")');

  if (error) {
    console.error('[ExpiryJob] Error fetching permits:', error.message);
    return;
  }

  let updated = 0;
  let notificationsCreated = 0;

  for (const permit of permits || []) {
    const days = daysUntilExpiry(permit.expiry_date);
    const newStatus = computePermitStatus(permit.expiry_date, permit.status);

    if (newStatus !== permit.status && !['pending_verification', 'renewal_in_progress', 'suspicious'].includes(permit.status)) {
      await supabaseAdmin.from('permits').update({ status: newStatus }).eq('id', permit.id);
      updated++;
    }

    for (const threshold of env.expiryThresholds) {
      if (days === threshold || (threshold === 0 && days === 0) || (days < 0 && threshold === 0 && days === -1)) {
        const title = days < 0
          ? `Permit Expired: ${permit.permit_number}`
          : days === 0
            ? `Permit Expires Today: ${permit.permit_number}`
            : `Permit Expiring in ${days} days`;

        const message = days < 0
          ? `Your permit ${permit.permit_number} expired on ${permit.expiry_date}. Immediate renewal action required.`
          : `Permit ${permit.permit_number} expires on ${permit.expiry_date} (${days} days remaining).`;

        await notificationService.notifyForeignNational(permit.foreign_national_id, {
          permit_id: permit.id,
          title,
          message,
          notification_type: 'expiry_reminder',
          priority: days <= 7 ? 'high' : days <= 30 ? 'normal' : 'low',
        });

        await notificationService.notifyOrganisationOfficers(permit.organisation_id, {
          permit_id: permit.id,
          title,
          message,
          notification_type: 'expiry_reminder',
          priority: days <= 14 ? 'high' : 'normal',
        });

        if (days < 0) {
          await alertService.create({
            permit_id: permit.id,
            foreign_national_id: permit.foreign_national_id,
            organisation_id: permit.organisation_id,
            alert_type: 'permit_expired',
            priority: 'high',
            message: `Permit ${permit.permit_number} for ${permit.foreign_nationals?.full_name} has expired.`,
          });
        }

        notificationsCreated++;
      }
    }
  }

  console.log(`[ExpiryJob] Complete. Updated ${updated} permits, created ~${notificationsCreated} notifications.`);
}

function startExpiryJob() {
  const cron = require('node-cron');
  cron.schedule('0 6 * * *', runExpiryCheck);
  console.log('[ExpiryJob] Scheduled daily at 06:00 UTC');
}

module.exports = { runExpiryCheck, startExpiryJob };
