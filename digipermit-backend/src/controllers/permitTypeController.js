const permitTypeService = require('../services/permitTypeService');
const { success } = require('../utils/apiResponse');

exports.getAll = async (req, res, next) => {
  try { return success(res, await permitTypeService.getAll(req.query)); } catch (err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try { return success(res, await permitTypeService.getById(req.params.id)); } catch (err) { next(err); }
};
exports.create = async (req, res, next) => {
  try { return success(res, await permitTypeService.create(req.body), 'Permit type created', 201); } catch (err) { next(err); }
};
exports.update = async (req, res, next) => {
  try { return success(res, await permitTypeService.update(req.params.id, req.body), 'Permit type updated'); } catch (err) { next(err); }
};
exports.remove = async (req, res, next) => {
  try { return success(res, await permitTypeService.deactivate(req.params.id), 'Permit type deactivated'); } catch (err) { next(err); }
};
