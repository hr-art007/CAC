const express = require('express');
const router = express.Router();
const { getAllDecisions, getDecisionById, createDecision, updateDecision, deleteDecision, getDecisionStats } = require('../controllers/decisionController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getAllDecisions);
router.get('/stats', getDecisionStats);
router.get('/:id', getDecisionById);
router.post('/', authorize('admin', 'chair'), createDecision);
router.put('/:id', authorize('admin', 'chair', 'staff'), updateDecision);
router.delete('/:id', authorize('admin'), deleteDecision);

module.exports = router;
