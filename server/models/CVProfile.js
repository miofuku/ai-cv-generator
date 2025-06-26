const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CVProfile = sequelize.define('CVProfile', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  targetPosition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  availabilityDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  salaryExpectation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workPermitStatus: {
    type: DataTypes.ENUM('citizen', 'permanent_resident', 'work_permit', 'visa_required'),
    allowNull: true
  },
  drivingLicense: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  willingToRelocate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  languages: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  additionalInfo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completionStatus: {
    type: DataTypes.ENUM('draft', 'in_progress', 'completed'),
    defaultValue: 'draft'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cv_profiles',
  timestamps: true
});

module.exports = CVProfile;
