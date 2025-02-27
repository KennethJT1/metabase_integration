const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connection');

const ApiKey = sequelize.define('ApiKey', {
  key: { type: DataTypes.STRING, allowNull: false, unique: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

module.exports = ApiKey;
