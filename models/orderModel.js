const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to user"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [0, "Quantity can not be negative"],
        },
        itemPrice: Number,
        itemPriceAfterDiscount: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
      details: String,
      city: String,
      governorate: String,
      postalCode: String,
      phone: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({
    path: "products.product",
    select: "title imageCover ",
  });

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
