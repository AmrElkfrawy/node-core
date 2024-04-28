const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("user"));
router
  .route("/")
  .post(cartController.addProductToCart)
  .get(cartController.getLoggedUserCart)
  .delete(cartController.clearCart);

router
  .route("/:itemId")
  .patch(cartController.updateCartItemQuantity)
  .delete(cartController.removeSpecificCartItem);

module.exports = router;
