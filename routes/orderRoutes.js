const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/checkout-session/:cartId",
  authController.protect,
  orderController.getCheckoutSession
);

router.get("/create", orderController.createOrderCheckout);

router.use(authController.protect);
router.route("/:id").get(orderController.getOrder);
router
  .route("/")
  .get(orderController.filterOrders, orderController.getAllOrders);

router.use(authController.restrictTo("admin"));
router
  .route("/:id")
  .delete(orderController.deleteOrder)
  .patch(orderController.filterBody, orderController.updateOrder);
module.exports = router;
