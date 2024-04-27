const express = require("express");
const categoryController = require("./../controllers/categoryController");
const authController = require("../controllers/authController");

const productRouter = require("./productRoutes");

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.deleteCategory
  );

router.use("/:categoryId/products", productRouter);

module.exports = router;
