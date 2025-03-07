const { Sequelize, DataTypes } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/./config.js`)[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
  }
);
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connection established successfully"))
  .catch((err) => console.error("❌ Unable to connect to database:", err));

const inferDataType = (value) => {
  if (typeof value === "number" && Number.isInteger(value)) {
    return DataTypes.INTEGER;
  } else if (typeof value === "number") {
    return DataTypes.FLOAT;
  } else if (typeof value === "boolean") {
    return DataTypes.BOOLEAN;
  } else if (Array.isArray(value) || typeof value === "object") {
    return DataTypes.JSON;
  } else if (typeof value === "string") {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(value)) {
      return DataTypes.UUID;
    }
    return DataTypes.STRING(5000);
  } else {
    return DataTypes.STRING(5000);
  }
};

const defineDynamicModel = (tableName, dataSample) => {
  const attributes = {};

  if (dataSample.id !== undefined) {
    const idType = inferDataType(dataSample.id);
    attributes.id = {
      type: idType,
      primaryKey: true,
    };
    if (idType === DataTypes.UUID) {
      attributes.id.defaultValue = DataTypes.UUIDV4;
    } else if (idType === DataTypes.INTEGER) {
      attributes.id.autoIncrement = true;
    }
  } else {
    attributes.id = {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    };
  }

  Object.entries(dataSample).forEach(([key, value]) => {
    if (key !== "id") {
      attributes[key] = { type: inferDataType(value) };
    }
  });

  return sequelize.define(tableName, attributes, { timestamps: false });
};

module.exports = { sequelize, inferDataType, defineDynamicModel };
