const renewalService = require('../services/renewalService');
const notificationService = require('../services/notificationService');
const alertService = require('../services/alertService');
const iotService = require('../services/iotService');
const analyticsService = require('../services/analyticsService');
const { success } = require('../utils/apiResponse');

exports.getRenewals = async (req, res, next) => {
  try { return success(res, await renewalService.getAll(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getRenewalById = async (req, res, next) => {
  try { return success(res, await renewalService.getById(req.params.id, req.profile)); } catch (err) { next(err); }
};
exports.createRenewal = async (req, res, next) => {
  try { return success(res, await renewalService.create(req.body, req.profile), 'Request submitted', 201); } catch (err) { next(err); }
};
exports.approveRenewal = async (req, res, next) => {
  try { return success(res, await renewalService.review(req.params.id, 'approved', req.profile, req.body.notes), 'Request approved'); } catch (err) { next(err); }
};
exports.rejectRenewal = async (req, res, next) => {
  try { return success(res, await renewalService.review(req.params.id, 'rejected', req.profile, req.body.notes), 'Request rejected'); } catch (err) { next(err); }
};
exports.requestChanges = async (req, res, next) => {
  try { return success(res, await renewalService.review(req.params.id, 'requires_changes', req.profile, req.body.notes), 'Changes requested'); } catch (err) { next(err); }
};

exports.getNotifications = async (req, res, next) => {
  try { return success(res, await notificationService.getAll(req.profile, req.query)); } catch (err) { next(err); }
};
exports.markNotificationRead = async (req, res, next) => {
  try { return success(res, await notificationService.markAsRead(req.params.id, req.profile), 'Notification marked as read'); } catch (err) { next(err); }
};

exports.getAlerts = async (req, res, next) => {
  try { return success(res, await alertService.getAll(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getAlertById = async (req, res, next) => {
  try { return success(res, await alertService.getById(req.params.id)); } catch (err) { next(err); }
};
exports.resolveAlert = async (req, res, next) => {
  try { return success(res, await alertService.resolve(req.params.id, req.profile), 'Alert resolved'); } catch (err) { next(err); }
};

exports.simulateIot = async (req, res, next) => {
  try { return success(res, await iotService.simulateScan(req.body, req.profile, req.ip), 'IoT scan processed'); } catch (err) { next(err); }
};
exports.getIotEvents = async (req, res, next) => {
  try { return success(res, await iotService.getEvents(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getIotDevices = async (req, res, next) => {
  try { return success(res, await iotService.getDevices(req.profile)); } catch (err) { next(err); }
};
exports.createIotDevice = async (req, res, next) => {
  try { return success(res, await iotService.createDevice(req.body, req.profile), 'Device registered', 201); } catch (err) { next(err); }
};

exports.getSummary = async (req, res, next) => {
  try { return success(res, await analyticsService.getSummary(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getExpiry = async (req, res, next) => {
  try { return success(res, await analyticsService.getExpiryAnalytics()); } catch (err) { next(err); }
};
exports.getVerifications = async (req, res, next) => {
  try { return success(res, await analyticsService.getVerificationAnalytics()); } catch (err) { next(err); }
};
exports.getAlertAnalytics = async (req, res, next) => {
  try { return success(res, await analyticsService.getAlertAnalytics()); } catch (err) { next(err); }
};
exports.getPermitTypes = async (req, res, next) => {
  try { return success(res, await analyticsService.getPermitTypeAnalytics()); } catch (err) { next(err); }
};
exports.getOrganisations = async (req, res, next) => {
  try { return success(res, await analyticsService.getOrganisationAnalytics()); } catch (err) { next(err); }
};
exports.getSuspicious = async (req, res, next) => {
  try { return success(res, await analyticsService.getSuspiciousActivity()); } catch (err) { next(err); }
};
exports.getAiInsights = async (req, res, next) => {
  try { return success(res, await analyticsService.getAiInsights(req.profile)); } catch (err) { next(err); }
};
exports.getCharts = async (req, res, next) => {
  try { return success(res, await analyticsService.getChartData(req.profile, req.query)); } catch (err) { next(err); }
};
exports.getFilterOptions = async (req, res, next) => {
  try { return success(res, await analyticsService.getFilterOptions(req.profile)); } catch (err) { next(err); }
};
