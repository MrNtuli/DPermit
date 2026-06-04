function assertPasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
}

module.exports = { assertPasswordStrength };
