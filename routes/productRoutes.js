const express = require("express");
const productController = require("./../controllers/productController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductPhoto,
    productController.resizeProductPhoto,
    productController.setCategoryIdToBody,
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.uploadProductPhoto,
    productController.resizeProductPhoto,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

router.use("/:productId/reviews", reviewRouter);
module.exports = router;
