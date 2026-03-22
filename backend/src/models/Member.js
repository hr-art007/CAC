const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
  },
  role: {
    type: DataTypes.ENUM('chair', 'vice_chair', 'member', 'staff', 'advisor'),
    defaultValue: 'member',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'alumni'),
    defaultValue: 'active',
  },
  phone: {
    type: DataTypes.STRING,
  },
  organization: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  expertise: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  joinDate: {
    type: DataTypes.DATEONLY,
    field: 'join_date',
  },
  termEndDate: {
    type: DataTypes.DATEONLY,
    field: 'term_end_date',
  },
  availability: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  isAvailableForCommittee: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_available_for_committee',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'members',
  timestamps: true,
  underscored: true,
});

module.exports = Member;
