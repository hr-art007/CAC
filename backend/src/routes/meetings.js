const express = require('express');
const router = express.Router();
const { getAllMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting, recordAttendance, getMeetingAttendance, getMeetingStats } = require('../controllers/meetingController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get('/', getAllMeetings);
router.get('/stats', getMeetingStats);
router.get('/:id', getMeetingById);
router.post('/', authorize('admin', 'chair', 'staff'), createMeeting);
router.put('/:id', authorize('admin', 'chair', 'staff'), updateMeeting);
router.delete('/:id', authorize('admin', 'chair'), deleteMeeting);
router.post('/:id/attendance', authorize('admin', 'chair', 'staff'), recordAttendance);
router.get('/:id/attendance', getMeetingAttendance);

module.exports = router;
