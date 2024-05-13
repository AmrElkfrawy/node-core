const Category = require("./../models/categoryModel");
const factory = require("./handlerFactory");

exports.getAllCategories = factory.getAll(Category, {
  path: "subcategories",
  select: "name",
});
exports.getCategory = factory.getOne(Category, {
  path: "subcategories",
  select: "name",
});
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
