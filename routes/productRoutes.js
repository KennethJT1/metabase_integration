const express = require('express');
const { fetchProductData } = require('../services/productService');
const { insertIntoMetabase } = require('../services/metabaseService');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

router.get('/fetch', authenticateJWT, async (req, res) => {
  try {
    const products = await fetchProductData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/import', authenticateJWT, async (req, res) => {
  try {
    await insertIntoMetabase();
    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
