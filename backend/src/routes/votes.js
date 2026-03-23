const express = require('express');
const router = express.Router();
const { getAllVotes, getVoteById, createVote, updateVote, castVote, closeVote, getVoteStats } = require('../controllers/voteController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getAllVotes);
router.get('/stats', getVoteStats);
router.get('/:id', getVoteById);
router.post('/', authorize('admin', 'chair'), createVote);
router.post('/:id/cast', castVote);
router.post('/:id/close', authorize('admin', 'chair'), closeVote);
router.put('/:id', authorize('admin', 'chair'), updateVote);

module.exports = router;
