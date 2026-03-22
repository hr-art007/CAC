const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Survey = sequelize.define('Survey', {
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
  questions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'closed'),
    defaultValue: 'draft',
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_anonymous',
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
  },
  targetAudience: {
    type: DataTypes.ENUM('all', 'members', 'specific'),
    defaultValue: 'members',
    field: 'target_audience',
  },
  meetingId: {
    type: DataTypes.UUID,
    field: 'meeting_id',
  },
}, {
  tableName: 'surveys',
  timestamps: true,
  underscored: true,
});

module.exports = Survey;
