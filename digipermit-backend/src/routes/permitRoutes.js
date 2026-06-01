const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/permitController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('system_admin', 'employer_hr', 'university_officer', 'clinic_admin', 'foreign_national', 'immigration_officer', 'manager', 'auditor'), ctrl.getAll);
router.get('/:id', authorize('system_admin', 'employer_hr', 'university_officer', 'clinic_admin', 'foreign_national', 'immigration_officer', 'manager', 'auditor'), ctrl.getById);
router.post('/', authorize('system_admin', 'employer_hr', 'university_officer', 'clinic_admin'), ctrl.create);
router.put('/:id', authorize('system_admin', 'employer_hr', 'university_officer', 'clinic_admin', 'immigration_officer'), ctrl.update);
router.delete('/:id', authorize('system_admin', 'employer_hr'), ctrl.remove);
router.put('/:id/validate', authorize('system_admin', 'immigration_officer'), ctrl.validate);
router.put('/:id/reject', authorize('system_admin', 'immigration_officer'), ctrl.reject);
router.put('/:id/revoke', authorize('system_admin', 'immigration_officer'), ctrl.revoke);
router.put('/:id/archive', authorize('system_admin', 'employer_hr', 'immigration_officer'), ctrl.archive);

module.exports = router;
