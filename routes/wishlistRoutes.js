const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlistController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router
  .route("/")
  .get(wishlistController.getWishlist)
  .post(wishlistController.addToWishlist);
router.route("/:id").delete(wishlistController.removeFromWishlist);

module.exports = router;
