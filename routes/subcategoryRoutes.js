const express = require("express");
const subcategoryController = require("./../controllers/subcategoryController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    subcategoryController.setCategoryIdToBody,
    subcategoryController.createSubcategory
  )
  .get(
    subcategoryController.setCategoryIdToBody,
    subcategoryController.getAllSubcategories
  );
router
  .route("/:id")
  .get(subcategoryController.getSubcategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    subcategoryController.updateSubcategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    subcategoryController.deleteSubcategory
  );

module.exports = router;
