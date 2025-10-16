const knex = require('knex');
const config = require('../config/database');

// Determine the environment (default to development if NODE_ENV is not set)
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Create a Knex instance with the configuration
const db = knex(dbConfig);

// Test the database connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Export the Knex instance and test function
module.exports = {
  db,
  testConnection,
};
