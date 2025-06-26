const sequelize = require('../config/database');
const User = require('./User');
const CVProfile = require('./CVProfile');
const Skill = require('./Skill');
const WorkExperience = require('./WorkExperience');
const Education = require('./Education');
const ChatSession = require('./ChatSession');

// Define associations
User.hasMany(CVProfile, { foreignKey: 'userId', as: 'cvProfiles' });
CVProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

CVProfile.hasMany(Skill, { foreignKey: 'cvProfileId', as: 'skills' });
Skill.belongsTo(CVProfile, { foreignKey: 'cvProfileId', as: 'cvProfile' });

CVProfile.hasMany(WorkExperience, { foreignKey: 'cvProfileId', as: 'workExperiences' });
WorkExperience.belongsTo(CVProfile, { foreignKey: 'cvProfileId', as: 'cvProfile' });

CVProfile.hasMany(Education, { foreignKey: 'cvProfileId', as: 'educations' });
Education.belongsTo(CVProfile, { foreignKey: 'cvProfileId', as: 'cvProfile' });

User.hasMany(ChatSession, { foreignKey: 'userId', as: 'chatSessions' });
ChatSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

CVProfile.hasMany(ChatSession, { foreignKey: 'cvProfileId', as: 'chatSessions' });
ChatSession.belongsTo(CVProfile, { foreignKey: 'cvProfileId', as: 'cvProfile' });

module.exports = {
  sequelize,
  User,
  CVProfile,
  Skill,
  WorkExperience,
  Education,
  ChatSession
};
