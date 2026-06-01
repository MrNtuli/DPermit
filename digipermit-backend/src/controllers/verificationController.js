const verificationService = require('../services/verificationService');
const { success } = require('../utils/apiResponse');

exports.verify = async (req, res, next) => {
  try {
    const result = await verificationService.verifyByNumber(req.body.permit_number, req.profile, {
      note: req.body.note, ipAddress: req.ip,
    });
    return success(res, result, 'Verification complete');
  } catch (err) { next(err); }
};

exports.verifyQr = async (req, res, next) => {
  try {
    const result = await verificationService.verifyByQr(req.body.qr_value, req.profile, { note: req.body.note, ipAddress: req.ip });
    return success(res, result, 'QR verification complete');
  } catch (err) { next(err); }
};

exports.verifyRfid = async (req, res, next) => {
  try {
    const result = await verificationService.verifyByRfid(req.body.rfid_tag, req.profile, { note: req.body.note, ipAddress: req.ip });
    return success(res, result, 'RFID verification complete');
  } catch (err) { next(err); }
};

exports.getLogs = async (req, res, next) => {
  try { return success(res, await verificationService.getLogs(req.profile, req.query)); } catch (err) { next(err); }
};

exports.getLogById = async (req, res, next) => {
  try { return success(res, await verificationService.getLogById(req.params.id)); } catch (err) { next(err); }
};
