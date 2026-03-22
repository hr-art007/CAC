const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'scheduled_date',
  },
  endTime: {
    type: DataTypes.DATE,
    field: 'end_time',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meetingType: {
    type: DataTypes.ENUM('regular', 'special', 'emergency', 'virtual'),
    defaultValue: 'regular',
    field: 'meeting_type',
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  agenda: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  minutes: {
    type: DataTypes.TEXT,
  },
  actionItems: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'action_items',
  },
  meetingLink: {
    type: DataTypes.STRING,
    field: 'meeting_link',
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'reminder_sent',
  },
}, {
  tableName: 'meetings',
  timestamps: true,
  underscored: true,
});

module.exports = Meeting;
