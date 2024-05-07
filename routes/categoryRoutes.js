const express = require("express");
const categoryController = require("./../controllers/categoryController");
const authController = require("../controllers/authController");
const subcategoryRouter = require("./subcategoryRoutes");

const productRouter = require("./productRoutes");

const router = express.Router();

// Nested route
router.use("/:categoryID/subcategory", subcategoryRouter);
router.use("/:categoryID/products", productRouter);

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

router.use("/:categoryId/subcategories", subcategoryRouter);

module.exports = router;
