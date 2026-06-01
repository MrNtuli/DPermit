const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/miscController');

const router = express.Router();
router.use(authMiddleware);

router.get('/summary', authorize('system_admin', 'employer_hr', 'university_officer', 'clinic_admin', 'foreign_national', 'verification_officer', 'immigration_officer', 'manager', 'auditor'), ctrl.getSummary);
router.get('/expiry', authorize('system_admin', 'employer_hr', 'university_officer', 'immigration_officer', 'manager', 'auditor'), ctrl.getExpiry);
router.get('/verifications', authorize('system_admin', 'verification_officer', 'immigration_officer', 'manager', 'auditor'), ctrl.getVerifications);
router.get('/alerts', authorize('system_admin', 'immigration_officer', 'manager', 'auditor'), ctrl.getAlertAnalytics);
router.get('/permit-types', authorize('system_admin', 'manager', 'auditor'), ctrl.getPermitTypes);
router.get('/organisations', authorize('system_admin', 'manager', 'auditor'), ctrl.getOrganisations);
router.get('/suspicious-activity', authorize('system_admin', 'immigration_officer', 'manager', 'auditor', 'verification_officer'), ctrl.getSuspicious);
router.get('/ai-insights', authorize('system_admin', 'immigration_officer', 'manager', 'auditor', 'employer_hr'), ctrl.getAiInsights);

module.exports = router;
