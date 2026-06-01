const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/miscController');

const router = express.Router();
router.use(authMiddleware);

router.post('/simulate', authorize('verification_officer', 'system_admin'), ctrl.simulateIot);
router.get('/events', authorize('system_admin', 'verification_officer', 'manager', 'auditor'), ctrl.getIotEvents);
router.get('/devices', authorize('system_admin', 'verification_officer'), ctrl.getIotDevices);
router.post('/devices', authorize('system_admin'), ctrl.createIotDevice);

module.exports = router;
