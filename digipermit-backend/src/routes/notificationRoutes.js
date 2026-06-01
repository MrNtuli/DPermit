const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const ctrl = require('../controllers/miscController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', ctrl.getNotifications);
router.put('/:id/read', ctrl.markNotificationRead);

module.exports = router;
