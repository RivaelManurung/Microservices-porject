// index.js
const express = require("express");
require("dotenv").config();

const morgan = require("morgan");
const { Sequelize } = require("sequelize");

// Impor komponen
const rabbit = require("./src/config/rabbitmq");
const createUserModel = require("./src/models/user_models");
const UserService = require("./src/services/user_services");
const UserController = require("./src/api/controllers/user_controllers");
const createUserRoutes = require("./src/api/routes/user_routes").default;

const {
  PORT = 3001,
  RABBITMQ_URL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

(async () => {
  // 1. Inisialisasi Koneksi
  await rabbit.connectBus(RABBITMQ_URL);
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql",
  });
  await sequelize.authenticate();

  // 2. Inisialisasi Model, Service, dan Controller (Dependency Injection)
  const User = createUserModel(sequelize);
  await sequelize.sync({ alter: true });

  const userService = new UserService(User);
  const userController = new UserController(userService);

  // 3. Setup Aplikasi Express
  const app = express();
  app.use(morgan("dev"));
  app.use(express.json());

  // 4. Gunakan Routes
  app.use("/users", createUserRoutes(userController));

  app.listen(PORT, () => console.log(`user-service listening on ${PORT}`));
})();
