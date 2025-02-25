const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/./config.js`)[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
  }
);
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connection established successfully"))
  .catch((err) => console.error("❌ Unable to connect to database:", err));

module.exports = sequelize;
