const axios = require("axios");
const { sequelize } = require("../config/connection");
const {
  METABASE_URL,
  METABASE_LOGIN_USERNAME,
  METABASE_LOGIN_PASSWORD,
  METABASE_DB_ID,
} = require("../config/configSource");
const logger = require("../utils/logger");

// To generate the token session
async function getMetabaseSessionToken() {
  const response = await axios.post(`${METABASE_URL}/api/session`, {
    username: METABASE_LOGIN_USERNAME,
    password: METABASE_LOGIN_PASSWORD,
  });
  return response.data.id;
}

// to get the id of database in metabase
// async function listDatabases() {
//   const sessionToken = await getMetabaseSessionToken();

//   const response = await axios.get('http://localhost:3000/api/database', {
//     headers: { 'X-Metabase-Session': sessionToken }
//   });

//   console.log('✅ Databases:', response.data);
// }

// listDatabases();

async function triggerMetabaseSync() {
  const sessionToken = await getMetabaseSessionToken();

  const METABASE_API_URL = `${METABASE_URL}/api/database/${METABASE_DB_ID}/sync_schema`;

  await axios.post(
    METABASE_API_URL,
    {},
    {
      headers: { "X-Metabase-Session": sessionToken },
    }
  );

  logger.info("✅ Metabase schema sync triggered successfully");
}
async function refreshMetabaseSchema() {
  const sessionToken = await getMetabaseSessionToken();

  const METABASE_API_URL = `${METABASE_URL}/api/database/${METABASE_DB_ID}/sync_schema`;

  await axios.post(
    METABASE_API_URL,
    {},
    {
      headers: { "X-Metabase-Session": sessionToken },
    }
  );

  logger.info("✅ Metabase schema sync triggered successfully");
}

// Example combined flow — after table creation
async function createTableAndSyncMetabase(tableName, tableFields) {
  try {
    // 1. Create the dynamic table in PostgreSQL
    const defineDynamicModel =
      require("../config/connection").defineDynamicModel;
    const Model = defineDynamicModel(tableName, tableFields);

    await Model.sync();

    logger.info(`✅ Table '${tableName}' created or already exists`);

    await triggerMetabaseSync();

    logger.info(`✅ Table '${tableName}' synced to Metabase`);
  } catch (error) {
    logger.error(
      `❌ Error creating table & syncing Metabase: ${error.message}`
    );
    throw error;
  }
}

module.exports = {
  refreshMetabaseSchema,
  triggerMetabaseSync,
  createTableAndSyncMetabase,
};
