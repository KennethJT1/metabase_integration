const axios = require('axios');
const logger = require('../utils/logger');

const fetchProductData = async () => {
  try {
    const response = await axios.get('https://api.loremproduct.com/products');
    return response.data;
  } catch (error) {
    logger.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

module.exports = { fetchProductData };
