const authService = require('../services/authService');
const { success, error } = require('../utils/apiResponse');

exports.signup = async (req, res) => {
  return error(
    res,
    'Public registration is disabled. System administrators create user accounts via Admin → Users (POST /api/users).',
    403
  );
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password required');
    const result = await authService.login(email, password);
    return success(res, result, 'Login successful');
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.token);
    return success(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    return success(res, profile);
  } catch (err) { next(err); }
};
