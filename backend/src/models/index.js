const sequelize = require('../config/database');
const User = require('./User');
const Member = require('./Member');
const Meeting = require('./Meeting');
const MeetingAttendance = require('./MeetingAttendance');
const Document = require('./Document');
const Survey = require('./Survey');
const SurveyResponse = require('./SurveyResponse');
const Vote = require('./Vote');
const VoteRecord = require('./VoteRecord');
const Decision = require('./Decision');

// Associations
User.hasOne(Member, { foreignKey: 'user_id', as: 'member' });
Member.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Meeting.hasMany(MeetingAttendance, { foreignKey: 'meeting_id', as: 'attendances' });
MeetingAttendance.belongsTo(Meeting, { foreignKey: 'meeting_id', as: 'meeting' });
Member.hasMany(MeetingAttendance, { foreignKey: 'member_id', as: 'attendances' });
MeetingAttendance.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });

Meeting.hasMany(Document, { foreignKey: 'meeting_id', as: 'documents' });
Document.belongsTo(Meeting, { foreignKey: 'meeting_id', as: 'meeting' });
User.hasMany(Document, { foreignKey: 'uploaded_by', as: 'documents' });
Document.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

Survey.hasMany(SurveyResponse, { foreignKey: 'survey_id', as: 'responses' });
SurveyResponse.belongsTo(Survey, { foreignKey: 'survey_id', as: 'survey' });
Member.hasMany(SurveyResponse, { foreignKey: 'member_id', as: 'surveyResponses' });
SurveyResponse.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });

Vote.hasMany(VoteRecord, { foreignKey: 'vote_id', as: 'records' });
VoteRecord.belongsTo(Vote, { foreignKey: 'vote_id', as: 'vote' });
Member.hasMany(VoteRecord, { foreignKey: 'member_id', as: 'voteRecords' });
VoteRecord.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });

User.hasMany(Meeting, { foreignKey: 'created_by', as: 'createdMeetings' });
Meeting.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Vote, { foreignKey: 'created_by', as: 'createdVotes' });
Vote.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Decision, { foreignKey: 'created_by', as: 'createdDecisions' });
Decision.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Vote.hasOne(Decision, { foreignKey: 'vote_id', as: 'decision' });
Decision.belongsTo(Vote, { foreignKey: 'vote_id', as: 'vote' });

module.exports = {
  sequelize,
  User,
  Member,
  Meeting,
  MeetingAttendance,
  Document,
  Survey,
  SurveyResponse,
  Vote,
  VoteRecord,
  Decision,
};
