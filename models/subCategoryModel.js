const mongoose = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "Too short SubCategory name"],
      maxlength: [32, "Too long SubCategory name"],
      required: [true, "SubCategory name must be provided"],
    },
    slug: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

subCategorySchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
