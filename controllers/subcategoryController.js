const Subcategory = require("../models/subCategoryModel");
const factory = require("./handlerFactory");
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
exports.getAllSubcategories = factory.getAll(Subcategory);
exports.getSubcategory = factory.getOne(Subcategory);
exports.createSubcategory = factory.createOne(Subcategory);
exports.updateSubcategory = factory.updateOne(Subcategory);
exports.deleteSubcategory = factory.deleteOne(Subcategory);
