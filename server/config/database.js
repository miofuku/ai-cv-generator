const { Sequelize } = require('sequelize');

// Determine database configuration based on DATABASE_URL
let sequelize;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://')) {
  // PostgreSQL configuration
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // SQLite configuration for testing/development
  const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || './test.db';
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
}

module.exports = sequelize;
