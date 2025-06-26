const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Education = sequelize.define('Education', {
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
  institutionName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fieldOfStudy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  educationType: {
    type: DataTypes.ENUM('formal', 'vocational', 'certification', 'apprenticeship', 'online'),
    allowNull: false,
    defaultValue: 'formal'
  }
}, {
  tableName: 'educations',
  timestamps: true
});

module.exports = Education;
