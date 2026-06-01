const organisationService = require('../services/organisationService');
const { success, error } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try { return success(res, await organisationService.getAll(req.query)); } catch (err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try { return success(res, await organisationService.getById(req.params.id)); } catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try { return success(res, await organisationService.create(req.body), 'Organisation created', 201); } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try { return success(res, await organisationService.update(req.params.id, req.body), 'Organisation updated'); } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try {
    const action = req.query.action || 'deactivate';
    const result = action === 'archive'
      ? await organisationService.archive(req.params.id)
      : await organisationService.deactivate(req.params.id);
    return success(res, result, `Organisation ${action}d`);
  } catch (err) { next(err); }
};
