const { Meeting, Member, MeetingAttendance, User } = require('../models');
const { Op } = require('sequelize');

const getAllMeetings = async (req, res, next) => {
  try {
    const { status, from, to, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (from || to) {
      where.scheduledDate = {};
      if (from) where.scheduledDate[Op.gte] = new Date(from);
      if (to) where.scheduledDate[Op.lte] = new Date(to);
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Meeting.findAndCountAll({
      where,
      include: [{ association: 'creator', attributes: ['id', 'firstName', 'lastName'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['scheduledDate', 'DESC']],
    });

    res.json({ success: true, data: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) } });
  } catch (error) {
    next(error);
  }
};

const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id, {
      include: [
        { association: 'creator', attributes: ['id', 'firstName', 'lastName'] },
        { association: 'attendances', include: [{ association: 'member', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }] }] },
        { association: 'documents' },
      ],
    });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

const createMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Meeting created', data: meeting });
  } catch (error) {
    next(error);
  }
};

const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    await meeting.update(req.body);
    res.json({ success: true, message: 'Meeting updated', data: meeting });
  } catch (error) {
    next(error);
  }
};

const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    await meeting.update({ status: 'cancelled' });
    res.json({ success: true, message: 'Meeting cancelled' });
  } catch (error) {
    next(error);
  }
};

const recordAttendance = async (req, res, next) => {
  try {
    const { attendances } = req.body;
    const { id: meetingId } = req.params;

    const meeting = await Meeting.findByPk(meetingId);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    const records = await Promise.all(
      attendances.map(async ({ memberId, status, notes }) => {
        const [record, created] = await MeetingAttendance.findOrCreate({
          where: { meetingId, memberId },
          defaults: { meetingId, memberId, status, notes },
        });
        if (!created) await record.update({ status, notes });
        return record;
      })
    );

    res.json({ success: true, message: 'Attendance recorded', data: records });
  } catch (error) {
    next(error);
  }
};

const getMeetingAttendance = async (req, res, next) => {
  try {
    const attendance = await MeetingAttendance.findAll({
      where: { meetingId: req.params.id },
      include: [{ association: 'member', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] }],
    });
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

const getMeetingStats = async (req, res, next) => {
  try {
    const total = await Meeting.count();
    const scheduled = await Meeting.count({ where: { status: 'scheduled' } });
    const completed = await Meeting.count({ where: { status: 'completed' } });
    const cancelled = await Meeting.count({ where: { status: 'cancelled' } });
    res.json({ success: true, data: { total, scheduled, completed, cancelled } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting, recordAttendance, getMeetingAttendance, getMeetingStats };
