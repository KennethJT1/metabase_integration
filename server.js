const express = require('express');
const helmet = require('helmet');
const cors = require("cors");

const rateLimit = require('express-rate-limit');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use('/api/products', productRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
