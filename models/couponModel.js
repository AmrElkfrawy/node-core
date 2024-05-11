const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Please enter a coupon code"],
    },
    discount: {
      type: Number,
      required: [true, "Please enter a discount value"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Please enter a expiry date"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
