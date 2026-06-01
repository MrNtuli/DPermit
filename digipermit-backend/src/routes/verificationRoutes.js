const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const vCtrl = require('../controllers/verificationController');

const router = express.Router();
router.use(authMiddleware);

router.post('/', authorize('verification_officer', 'employer_hr', 'university_officer', 'clinic_admin', 'system_admin', 'immigration_officer'), vCtrl.verify);
router.post('/qr', authorize('verification_officer', 'employer_hr', 'university_officer', 'clinic_admin', 'system_admin'), vCtrl.verifyQr);
router.post('/rfid', authorize('verification_officer', 'system_admin'), vCtrl.verifyRfid);

const logRouter = express.Router();
logRouter.use(authMiddleware);
logRouter.get('/', authorize('system_admin', 'verification_officer', 'employer_hr', 'university_officer', 'immigration_officer', 'manager', 'auditor'), vCtrl.getLogs);
logRouter.get('/:id', authorize('system_admin', 'verification_officer', 'immigration_officer', 'manager', 'auditor'), vCtrl.getLogById);

module.exports = { router, logRouter };
