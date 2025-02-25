const axios = require('axios');
const logger = require('../utils/logger');
const { PRODUCT_URL } = require('../config/configSource');
const { insertIntoMetabase } = require('../utils/metabase');

const fetchProductData = async () => {
  try {
    const response = await axios.get(PRODUCT_URL);
    return response.data;
  } catch (error) {
    logger.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

const inportDataToMetabase = async (req, res) => {
  try {
    await insertIntoMetabase();
    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchProductData,inportDataToMetabase };
