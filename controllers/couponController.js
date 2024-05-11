const Coupon = require("../models/couponModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");

exports.createCoupon = handlerFactory.createOne(Coupon);
exports.getAllCoupon = handlerFactory.getAll(Coupon);
exports.getCoupon = handlerFactory.getOne(Coupon);
exports.updateCoupon = handlerFactory.updateOne(Coupon);
exports.deleteCoupon = handlerFactory.deleteOne(Coupon);

exports.filterBody = (req, res, next) => {
  const filteredBody = {};
  if (req.body.hasOwnProperty("discount")) {
    filteredBody.discount = req.body.discount;
  }
  if (req.body.hasOwnProperty("expiryDate")) {
    filteredBody.expiryDate = req.body.expiryDate;
  }
  req.body = filteredBody;
  next();
};
