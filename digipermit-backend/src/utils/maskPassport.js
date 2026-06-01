function maskPassport(passportNumber) {
  if (!passportNumber || passportNumber.length < 4) return '****';
  const visible = 2;
  return passportNumber.slice(0, visible) + '*'.repeat(Math.max(passportNumber.length - visible * 2, 3)) + passportNumber.slice(-visible);
}

module.exports = { maskPassport };
