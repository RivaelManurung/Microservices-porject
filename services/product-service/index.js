require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const axios = require('axios'); // <-- Import axios

const bus = require('./src/config/rabbitmq');
const createProductModel = require('./src/models/product_models');
const ProductService = require('./src/services/product_services');
const ProductController = require('./src/api/controllers/product_controllers');
const createProductRoutes = require('./src/api/routes/product_routes');

const {
  PORT, RABBITMQ_URL, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT,
  CATEGORY_SERVICE_URL // <-- URL service kategori
} = process.env;

(async () => {
  try {
    await bus.connectBus(RABBITMQ_URL);
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mysql',
    });
    await sequelize.authenticate();

    const Product = createProductModel(sequelize);
    await sequelize.sync({ alter: true });

    // Buat instance axios untuk berkomunikasi dengan Category Service
    const categoryApi = axios.create({ baseURL: CATEGORY_SERVICE_URL });

    // Kirim model dan api client ke service
    const productService = new ProductService(Product, categoryApi);
    const productController = new ProductController(productService);

    await bus.subscribe('order.created', async ({ payload }) => {
      // ... (logika penanganan event sama)
    });

    const app = express();
    app.use(morgan('dev'));
    app.use(express.json());
    app.use('/products', createProductRoutes(productController));
    app.listen(PORT, () => console.log(`${process.env.SERVICE_NAME} listening on ${PORT}`));

  } catch (error) {
    console.error("Failed to start product-service:", error);
    process.exit(1);
  }
})();