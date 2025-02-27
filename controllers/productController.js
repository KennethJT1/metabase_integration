const ApiKey = require("../models/apiKey");
const axios = require("axios");
const logger = require("../utils/logger");
const { defineDynamicModel } = require("../config/connection");
const { createTableAndSyncMetabase } = require("../utils/metabase");
exports.generateApiKey = async (req, res) => {
  try {
    const { productId } = req.body;
    const apiKey = require("crypto").randomBytes(20).toString("hex");

    await ApiKey.create({ key: apiKey, productId });

    res.json({ apiKey });
  } catch (error) {
    logger.error(`❌ Error generating API key: ${error.message}`);
    res.status(500).json({ message: "Error generating API key" });
  }
};

exports.syncProductData = async (req, res) => {
  try {
    const { apiUrl, tableName } = req.body;
    if (!apiUrl || !tableName) {
      return res
        .status(400)
        .json({ message: "API URL and table name are required" });
    }

    const response = await axios.get(apiUrl);
    const products = response.data;

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty data from API" });
    }

    const ProductModel = defineDynamicModel(tableName, products[0]);
    await ProductModel.sync();

    await createTableAndSyncMetabase(tableName, products[0]);

    // Fetch existing records to prevent duplication
    const existingIds = new Set(
      (await ProductModel.findAll({ attributes: ["id"] })).map((p) => p.id)
    );

    const newProducts = products.filter(
      (product) => !existingIds.has(product.id)
    );

    if (newProducts.length === 0) {
      return res.status(200).json({
        message: `✅ All data already exists in '${tableName}', nothing to insert.`,
      });
    }

    // Insert only new products (no duplicates)
    await ProductModel.bulkCreate(newProducts, { ignoreDuplicates: true });

    res.status(200).json({
      message: `✅ Synced successfully. Added ${newProducts.length} new records into '${tableName}'.`,
    });
  } catch (error) {
    console.error(`❌ Error syncing product data:`, error);
    res.status(500).json({
      message: "Error syncing product data",
      error: error.message || error.toString(),
    });
  }
};
