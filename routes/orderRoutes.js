const express = require("express");
const orderController = require("../controllers/orderController");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/checkout-session/:cartId",
  authController.protect,
  orderController.getCheckoutSession
);

router.get(
  "/create",
  orderController.createOrderCheckout,
  productController.getAllProducts
);

module.exports = router;
