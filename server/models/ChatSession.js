const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatSession = sequelize.define('ChatSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  cvProfileId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'cv_profiles',
      key: 'id'
    }
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  messages: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  currentStep: {
    type: DataTypes.STRING,
    allowNull: true
  },
  extractedData: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en'
  }
}, {
  tableName: 'chat_sessions',
  timestamps: true
});

module.exports = ChatSession;
