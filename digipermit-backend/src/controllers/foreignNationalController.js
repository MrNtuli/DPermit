const foreignNationalService = require('../services/foreignNationalService');
const { success } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try { return success(res, await foreignNationalService.getAll(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try { return success(res, await foreignNationalService.getById(req.params.id, req.profile)); } catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try { return success(res, await foreignNationalService.create(req.body, req.profile), 'Foreign national registered', 201); } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try { return success(res, await foreignNationalService.update(req.params.id, req.body, req.profile), 'Record updated'); } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try { return success(res, await foreignNationalService.archive(req.params.id, req.profile), 'Record archived'); } catch (err) { next(err); }
};
