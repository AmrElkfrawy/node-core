const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: String,
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity can not be negative"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    images: [String],
    colors: [String],
  },
  { timestamps: true }
);

productSchema.index({ name: 1, category: 1, brand: 1 }, { unique: true });

productSchema.pre("save", function (next) {
  this.priceAfterDiscount = this.price - (this.price * this.discount) / 100;
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
