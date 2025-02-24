const axios = require('axios');
const { Product } = require('../models');
const logger = require('../utils/logger');

const insertIntoMetabase = async () => {
  try {
    const products = await Product.findAll();
    await axios.post(`${process.env.METABASE_URL}/api/database`, {
      name: 'Products',
      connection_details: { host: process.env.DB_HOST },
      tables: products
    }, { headers: { 'X-Metabase-Session': process.env.METABASE_API_KEY } });

    logger.info('Data successfully inserted into Metabase');
  } catch (error) {
    logger.error('Error inserting data into Metabase:', error);
  }
};

module.exports = { insertIntoMetabase };
