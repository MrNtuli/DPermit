const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/miscController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('system_admin', 'employer_hr', 'university_officer', 'clinic_admin', 'immigration_officer', 'manager', 'auditor'), ctrl.getAlerts);
router.get('/:id', authorize('system_admin', 'employer_hr', 'university_officer', 'immigration_officer', 'manager', 'auditor'), ctrl.getAlertById);
router.put('/:id/resolve', authorize('system_admin', 'employer_hr', 'university_officer', 'immigration_officer'), ctrl.resolveAlert);

module.exports = router;
