require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');

const bus = require('./src/config/rabbitmq');
const createCategoryModel = require('./src/models/category_model');
const CategoryService = require('./src/services/category_services');
const CategoryController = require('./src/api/controllers/category_controllers');
const createCategoryRoutes = require('./src/api/routes/category_routes');

const { PORT = 3004, RABBITMQ_URL, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

(async () => {
    try {
        await bus.connectBus(RABBITMQ_URL);
        const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            port: DB_PORT,
            dialect: 'mysql',
        });
        await sequelize.authenticate();

        const Category = createCategoryModel(sequelize);
        await sequelize.sync({ alter: true });

        const categoryService = new CategoryService(Category);
        const categoryController = new CategoryController(categoryService);

        const app = express();
        app.use(morgan('dev'));
        app.use(express.json());
        app.use('/categories', createCategoryRoutes(categoryController));
        app.listen(PORT, () => console.log(`${process.env.SERVICE_NAME} listening on ${PORT}`));
    } catch (error) {
        console.error("Failed to start category-service:", error);
        process.exit(1);
    }
})();