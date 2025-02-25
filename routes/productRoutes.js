const express = require('express');
const { fetchProductData } = require('../controllers/productController');
const { authenticateJWT } = require('../middlewares/auth');
const { inportDataToMetabase } = require('../controllers/productController');

const router = express.Router();

router.get('/fetch', authenticateJWT, async (req, res) => {
  try {
    const products = await fetchProductData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/import', authenticateJWT,inportDataToMetabase );

module.exports = router;
