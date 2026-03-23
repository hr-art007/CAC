const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vote = sequelize.define('Vote', {
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
  options: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  results: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'cancelled'),
    defaultValue: 'open',
  },
  votingMethod: {
    type: DataTypes.ENUM('simple_majority', 'two_thirds', 'unanimous'),
    defaultValue: 'simple_majority',
    field: 'voting_method',
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
  },
  meetingId: {
    type: DataTypes.UUID,
    field: 'meeting_id',
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_anonymous',
  },
  quorumRequired: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'quorum_required',
  },
}, {
  tableName: 'votes',
  timestamps: true,
  underscored: true,
});

module.exports = Vote;
