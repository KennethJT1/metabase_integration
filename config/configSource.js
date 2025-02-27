const dotenv = require("dotenv").config();

const PRODUCT_URL = process.env.PRODUCT_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const METABASE_URL = process.env.METABASE_URL;
const METABASE_LOGIN_USERNAME = process.env.METABASE_LOGIN_USERNAME;
const METABASE_LOGIN_PASSWORD = process.env.METABASE_LOGIN_PASSWORD;
const METABASE_DB_ID = process.env.METABASE_DB_ID;

module.exports = {
  PRODUCT_URL,
  JWT_SECRET,
  PORT,
  METABASE_URL,
  METABASE_LOGIN_USERNAME,
  METABASE_LOGIN_PASSWORD,
  METABASE_DB_ID,
};
