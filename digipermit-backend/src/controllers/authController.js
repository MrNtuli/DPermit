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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email is required', 400);
    const result = await authService.requestPasswordReset(email);
    return success(res, result, result.message);
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { access_token, new_password } = req.body;
    if (!access_token || !new_password) {
      return error(res, 'Reset token and new password are required', 400);
    }
    await authService.completePasswordReset(access_token, new_password);
    return success(res, null, 'Password updated. You can sign in with your new password.');
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return error(res, 'Current and new password are required', 400);
    }
    await authService.changePassword(
      req.user.id,
      req.profile.email,
      current_password,
      new_password
    );
    return success(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
};
