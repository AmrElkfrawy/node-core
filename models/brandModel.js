const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
    },
    slug: String,
    image: String,
  },
  { timestamps: true }
);

brandSchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
