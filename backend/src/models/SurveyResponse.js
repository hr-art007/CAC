const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SurveyResponse = sequelize.define('SurveyResponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  surveyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'survey_id',
  },
  memberId: {
    type: DataTypes.UUID,
    field: 'member_id',
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_anonymous',
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'submitted_at',
  },
}, {
  tableName: 'survey_responses',
  timestamps: true,
  underscored: true,
});

module.exports = SurveyResponse;
