function daysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function computePermitStatus(expiryDate, currentStatus) {
  if (['revoked', 'rejected', 'archived', 'suspicious', 'renewal_in_progress', 'pending_verification'].includes(currentStatus)) {
    return currentStatus;
  }
  const days = daysUntilExpiry(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'active';
}

function computeVerificationResult(permit, qrMatch = true, rfidMatch = true) {
  if (!permit) return 'not_found';
  if (permit.status === 'archived') return 'archived';
  if (!qrMatch || !rfidMatch) return 'suspicious';
  if (permit.status === 'revoked') return 'revoked';
  if (permit.status === 'rejected') return 'rejected';
  if (permit.status === 'pending_verification') return 'pending_verification';
  if (permit.status === 'renewal_in_progress') return 'renewal_in_progress';
  if (permit.status === 'suspicious') return 'suspicious';

  const days = daysUntilExpiry(permit.expiry_date);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'valid';
}

function generateQrValue(permitNumber) {
  return `DIGIPERMIT:${permitNumber}`;
}

function generateRfidTag() {
  return `RFID-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

module.exports = {
  daysUntilExpiry,
  computePermitStatus,
  computeVerificationResult,
  generateQrValue,
  generateRfidTag,
};
