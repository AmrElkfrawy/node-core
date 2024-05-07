const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    slug: String,

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
    sold: {
      type: Number,
      default: 0,
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
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
    images: [String],
  },
  { timestamps: true }
);

productSchema.index({ name: 1, category: 1, brand: 1 }, { unique: true });

productSchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  this.priceAfterDiscount = this.price - (this.price * this.discount) / 100;
  next();
});

productSchema.pre(/^find/, function (next) {
  const excludeCategoryAndBrand = !this.getOptions().excludeCategoryAndBrand;
  if (excludeCategoryAndBrand) {
    this.populate({
      path: "category",
      select: "name",
    })
      .populate({
        path: "brand",
        select: "name",
      })
      .populate({
        path: "subCategory",
        select: "name",
      });
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
