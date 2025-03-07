const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const productRoutes = require("./routes/productRoutes");
const logger = require("./utils/logger");
const { sequelize } = require("./config/connection");
const { PORT } = require("./config/configSource");
require("./controllers/syncDataTask"); 

const morganFormat = ":method :url :status :response-time ms";

const app = express();
const port = PORT || 5467;

sequelize
  .sync()
  .then(() => console.log("✅ Database & tables created!"))
  .catch((err) => console.error("❌ Error syncing database:", err));

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Welcome to Metabase Integration");
});

app.use("/api/products", productRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
