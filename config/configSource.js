const dotenv = require("dotenv").config();

const PRODUCT_URL = process.env.PRODUCT_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;

module.exports = { PRODUCT_URL, JWT_SECRET,PORT };
