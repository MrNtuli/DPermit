const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/organisationController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('system_admin', 'manager', 'auditor'), ctrl.getAll);
router.get('/:id', authorize('system_admin', 'manager', 'auditor', 'employer_hr', 'university_officer', 'clinic_admin'), ctrl.getById);
router.post('/', authorize('system_admin'), ctrl.create);
router.put('/:id', authorize('system_admin'), ctrl.update);
router.delete('/:id', authorize('system_admin'), ctrl.remove);

module.exports = router;
