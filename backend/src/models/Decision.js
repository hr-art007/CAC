const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Decision = sequelize.define('Decision', {
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
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'implemented'),
    defaultValue: 'pending',
  },
  category: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  implementationDate: {
    type: DataTypes.DATEONLY,
    field: 'implementation_date',
  },
  implementationNotes: {
    type: DataTypes.TEXT,
    field: 'implementation_notes',
  },
  voteId: {
    type: DataTypes.UUID,
    field: 'vote_id',
  },
  meetingId: {
    type: DataTypes.UUID,
    field: 'meeting_id',
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
  },
  assignedTo: {
    type: DataTypes.UUID,
    field: 'assigned_to',
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    field: 'due_date',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'decisions',
  timestamps: true,
  underscored: true,
});

module.exports = Decision;
