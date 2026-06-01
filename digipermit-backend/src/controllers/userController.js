const userService = require('../services/userService');
const { success } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try { return success(res, await userService.getAll(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try { return success(res, await userService.getById(req.params.id, req.profile)); } catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try { return success(res, await userService.create(req.body, req.profile), 'User created', 201); } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try { return success(res, await userService.update(req.params.id, req.body, req.profile), 'User updated'); } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try { return success(res, await userService.update(req.params.id, { status: 'inactive' }, req.profile), 'User deactivated'); } catch (err) { next(err); }
};
