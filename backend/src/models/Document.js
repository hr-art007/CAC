const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
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
  type: {
    type: DataTypes.ENUM('agenda', 'minutes', 'report', 'policy', 'other'),
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    field: 'file_name',
  },
  filePath: {
    type: DataTypes.STRING,
    field: 'file_path',
  },
  fileSize: {
    type: DataTypes.INTEGER,
    field: 'file_size',
  },
  mimeType: {
    type: DataTypes.STRING,
    field: 'mime_type',
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: '1.0',
  },
  meetingId: {
    type: DataTypes.UUID,
    field: 'meeting_id',
  },
  uploadedBy: {
    type: DataTypes.UUID,
    field: 'uploaded_by',
  },
  accessLevel: {
    type: DataTypes.ENUM('public', 'members_only', 'admin_only'),
    defaultValue: 'members_only',
    field: 'access_level',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'documents',
  timestamps: true,
  underscored: true,
});

module.exports = Document;
