const permitService = require('../services/permitService');
const { success } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try { return success(res, await permitService.getAll(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try { return success(res, await permitService.getById(req.params.id, req.profile)); } catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try { return success(res, await permitService.create(req.body, req.profile), 'Permit captured', 201); } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try { return success(res, await permitService.update(req.params.id, req.body, req.profile), 'Permit updated'); } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try { return success(res, await permitService.archive(req.params.id, req.profile), 'Permit archived'); } catch (err) { next(err); }
};
exports.validate = async (req, res, next) => {
  try { return success(res, await permitService.validate(req.params.id, req.profile), 'Permit validated'); } catch (err) { next(err); }
};
exports.reject = async (req, res, next) => {
  try { return success(res, await permitService.reject(req.params.id, req.body.reason, req.profile), 'Permit rejected'); } catch (err) { next(err); }
};
exports.revoke = async (req, res, next) => {
  try { return success(res, await permitService.revoke(req.params.id, req.body.reason, req.profile), 'Permit revoked'); } catch (err) { next(err); }
};
exports.archive = async (req, res, next) => {
  try { return success(res, await permitService.archive(req.params.id, req.profile), 'Permit archived'); } catch (err) { next(err); }
};
