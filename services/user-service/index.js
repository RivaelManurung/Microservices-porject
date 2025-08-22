require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const { Sequelize } = require("sequelize");

// Impor semua komponen yang diperlukan
const rabbit = require("./src/config/rabbitmq");
const createUserModel = require("./src/models/user_models");
const UserService = require("./src/services/user_services");
const AuthService = require("./src/services/auth_services");
const UserController = require("./src/api/controllers/user_controllers");
const createUserRoutes = require("./src/api/routes/user_routes");

const {
  PORT = 3001,
  RABBITMQ_URL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = process.env;

(async () => {
  try {
    // 1. Inisialisasi Koneksi
    await rabbit.connectBus(RABBITMQ_URL);
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: "mysql",
    });
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // 2. Inisialisasi Model, Service, dan Controller
    const User = createUserModel(sequelize);
    await sequelize.sync({ alter: true });

    // Inisialisasi Service dan Controller dengan Dependency Injection
    const userService = new UserService(User);
    const authService = new AuthService(User);
    const userController = new UserController(userService, authService);

    // 3. Setup Aplikasi Express
    const app = express();
    app.use(morgan("dev"));
    app.use(express.json());

    // 4. Daftarkan Routes ke Express
    app.use("/users", createUserRoutes(userController));

    app.listen(PORT, () => console.log(`user-service listening on ${PORT}`));

  } catch (error) {
    console.error("Failed to start service:", error);
    process.exit(1);
  }
})();