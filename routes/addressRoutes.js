const express = require("express");
const router = express.Router();

const addressController = require("../controllers/addressController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router
  .route("/")
  .get(addressController.getAddresses)
  .post(addressController.addAddress);
router.route("/:id").delete(addressController.deleteAddress);

module.exports = router;
