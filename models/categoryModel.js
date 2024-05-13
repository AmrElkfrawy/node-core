const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: String,
    slug: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("subcategories", {
  ref: "SubCategory",
  foreignField: "category",
  localField: "_id",
});

categorySchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
