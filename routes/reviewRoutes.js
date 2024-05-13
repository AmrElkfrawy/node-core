const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.setProductUserIds, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.checkIfAuth,
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.checkIfAuth,
    reviewController.updateReview
  );

module.exports = router;
