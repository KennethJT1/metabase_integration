const { defineDynamicModel } = require("../config/connection");
require("dotenv").config();
const axios = require("axios");
const cron = require("node-cron");
const logger = require("../utils/logger");
const { triggerMetabaseSync } = require("../utils/metabase");

const {
  CONNECTIFILE_BASEURL,
  CONNECTIFILE_EMAIL,
  CONNECTIFILE_PASSWORD,
} = require("../config/configSource");

const { SOURCES } = require("../config/externalEndpoints");

async function fetchData(source, token = null) {
  const url = source.url;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  let allData = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const params = new URLSearchParams({
      pageNumber: currentPage,
      pageSize: 10,
    });
    const pageUrl = `${url}?${params.toString()}`;

    logger.info(`Fetching page ${currentPage} from: ${pageUrl}`);

    const response = await axios.get(pageUrl, { headers });
    const pageData = response.data.data;

    allData = allData.concat(pageData);

    const totalRecords =
      response.data.pagination?.totalItems || pageData.length;
    const pageSize = 10;

    totalPages = Math.ceil(totalRecords / pageSize);
    currentPage++;
  }

  logger.info(`✅ Processed all data for ${source.name}`);
  return allData;
}

async function createTableIfNeeded(tableName, sampleData) {
  const model = defineDynamicModel(tableName, sampleData);
  await model.sync();
  return model;
}

async function insertData(model, data) {
  await model.destroy({ where: {} });

  for (const record of data) {
    const [instance, created] = await model.findOrCreate({
      where: { id: record.id },
      defaults: record,
    });

    if (created) {
      logger.info(`Inserted new record with id: ${record.id}`);
    } else {
      logger.info(`Record already existed with id: ${record.id}`);
    }
  }
}

async function syncAllSources() {
  for (const source of SOURCES) {
    const res = await axios.post(`${CONNECTIFILE_BASEURL}/api/login`, {
      email: CONNECTIFILE_EMAIL,
      password: CONNECTIFILE_PASSWORD,
    });

    const token = res.data.token;

    try {
      if (token) {
        const data = await fetchData(source, token);

        if (!Array.isArray(data) || data.length === 0) {
          logger.warn(`⚠️ No data for ${source.name}`);
          continue;
        }

        const model = await createTableIfNeeded(source.name, data[0]);

        await insertData(model, data);

        logger.info(`✅ Synced ${data.length} records into ${source.name}`);
      }
    } catch (error) {
      logger.error(`❌ Failed to sync ${source.name}: ${error.message}`);
    }
  }
}

const triggerSync = async (req, res) => {
  try {
    await syncAllSources();
    res.json({ message: "✅ Data sync started" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ Error starting data sync", error: error.message });
  }
};

async function runJob() {
  logger.info("🔄 Starting data sync job...");
  await syncAllSources();
  await triggerMetabaseSync();
  logger.info("✅ Data sync job completed.");
}

runJob().catch(console.error);
cron.schedule("0 */5 * * *", async () => {
  logger.info("⏰ Running scheduled sync (every 5 hours)");
  await runJob();
});

module.exports = { syncAllSources, triggerSync };
