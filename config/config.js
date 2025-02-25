const dotenv = require("dotenv").config();

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOSTNAME, DB_DIALECT } =
  process.env;

  module.exports = {
    development: { 
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      host: DB_HOSTNAME,
      dialect: DB_DIALECT || "postgres",
      pool: {
        max: 100,
        min: 0,
        acquire: 60000,
        idle: 10000,
      },
    },
    test: {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      host: DB_HOSTNAME,
      dialect: DB_DIALECT || "postgres",
    },
    staging: {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      host: DB_HOSTNAME,
      dialect: DB_DIALECT || "postgres",
    },
    production: {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      host: DB_HOSTNAME,
      dialect: DB_DIALECT || "postgres",
    },
  };
  
