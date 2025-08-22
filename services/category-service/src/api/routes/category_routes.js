const express = require("express");
const router = express.Router();

module.exports = (CategoryController) => {
  router.get("/categories", (req, res) =>
    CategoryController.getAllCategories(req, res)
  );
  router.post("/categories", (req, res) =>
    CategoryController.createCategory(req, res)
  );
  return router;
};
