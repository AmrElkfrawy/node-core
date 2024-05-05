const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: [0, "Quantity can not be negative"],
        },
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "name price discount image",
    options: { excludeCategoryAndBrand: true },
  });
  next();
});
cartSchema.pre("save", function (next) {
  this.populate({
    path: "cartItems.product",
    select: "name price image",
    options: { excludeCategoryAndBrand: true },
  });
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
