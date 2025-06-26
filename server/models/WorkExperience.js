const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkExperience = sequelize.define('WorkExperience', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cvProfileId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'cv_profiles',
      key: 'id'
    }
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isCurrentJob: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  achievements: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employmentType: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'temporary', 'seasonal'),
    allowNull: true
  }
}, {
  tableName: 'work_experiences',
  timestamps: true
});

module.exports = WorkExperience;
