const express = require("express");
const couponController = require("../controllers/couponController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(couponController.getAllCoupon);

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.route("/").post(couponController.createCoupon);

router
  .route("/:id")
  .get(couponController.getCoupon)
  .patch(couponController.filterBody, couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
