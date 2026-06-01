const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/miscController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('system_admin', 'employer_hr', 'university_officer', 'clinic_admin', 'foreign_national', 'immigration_officer'), ctrl.getRenewals);
router.get('/:id', authorize('system_admin', 'employer_hr', 'university_officer', 'foreign_national', 'immigration_officer'), ctrl.getRenewalById);
router.post('/', authorize('foreign_national', 'employer_hr', 'university_officer'), ctrl.createRenewal);
router.put('/:id/approve', authorize('system_admin', 'employer_hr', 'university_officer', 'immigration_officer'), ctrl.approveRenewal);
router.put('/:id/reject', authorize('system_admin', 'employer_hr', 'university_officer', 'immigration_officer'), ctrl.rejectRenewal);
router.put('/:id/request-changes', authorize('system_admin', 'employer_hr', 'university_officer', 'immigration_officer'), ctrl.requestChanges);

module.exports = router;
