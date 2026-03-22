const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VoteRecord = sequelize.define('VoteRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  voteId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'vote_id',
  },
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'member_id',
  },
  choice: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  votedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'voted_at',
  },
  comment: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'vote_records',
  timestamps: true,
  underscored: true,
});

module.exports = VoteRecord;
