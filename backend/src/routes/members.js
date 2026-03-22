const express = require('express');
const router = express.Router();
const { getAllMembers, getMemberById, createMember, updateMember, deleteMember, getMemberStats } = require('../controllers/memberController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getAllMembers);
router.get('/stats', getMemberStats);
router.get('/:id', getMemberById);
router.post('/', authorize('admin', 'chair'), createMember);
router.put('/:id', authorize('admin', 'chair'), updateMember);
router.delete('/:id', authorize('admin'), deleteMember);

module.exports = router;
