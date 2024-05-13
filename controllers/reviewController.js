const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.checkIfAuth = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError("No review found with that id", 404));
  }

  if (req.user.role !== "admin" && req.user.id !== review.user.id) {
    return next(new AppError("You can only edit your reviews", 401));
  }
  next();
});

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.tour) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};

exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
