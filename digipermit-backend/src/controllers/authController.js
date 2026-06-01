const authService = require('../services/authService');
const { success, error } = require('../utils/apiResponse');

exports.signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    return success(res, result, 'User registered successfully', 201);
  } catch (err) { next(err); }
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
