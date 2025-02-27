const express = require('express');
const { syncProductData, generateApiKey } = require('../controllers/productController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/sync', syncProductData);
// router.post('/sync', verifyToken, syncProductData);
router.post('/generate-api-key', verifyToken, generateApiKey);

module.exports = router;
