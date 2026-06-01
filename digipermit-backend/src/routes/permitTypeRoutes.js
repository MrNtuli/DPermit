const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/permitTypeController');

const router = express.Router();

router.get('/', authMiddleware, ctrl.getAll);
router.get('/:id', authMiddleware, ctrl.getById);
router.post('/', authMiddleware, authorize('system_admin'), ctrl.create);
router.put('/:id', authMiddleware, authorize('system_admin'), ctrl.update);
router.delete('/:id', authMiddleware, authorize('system_admin'), ctrl.remove);

module.exports = router;
