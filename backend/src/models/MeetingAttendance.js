const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeetingAttendance = sequelize.define('MeetingAttendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  meetingId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'meeting_id',
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'member_id',
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'excused'),
    defaultValue: 'present',
  },
  notes: {
    type: DataTypes.TEXT,
  },
  checkedInAt: {
    type: DataTypes.DATE,
    field: 'checked_in_at',
  },
}, {
  tableName: 'meeting_attendances',
  timestamps: true,
  underscored: true,
});

module.exports = MeetingAttendance;
