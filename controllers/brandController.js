const Brand = require("./../models/brandModel");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllBrands = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Brand.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const brands = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: brands.length,
    data: {
      brands,
    },
  });
});

exports.getBrand = catchAsync(async (req, res, next) => {
  const brandID = req.params.id;
  if (!brandID) {
    return next(new AppError("Brand name is required", 400));
  }
  const products = await Product.find({ brand: brandID });
  if (!products.length) {
    return next(new AppError("No products found for this brand", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

exports.createBrand = catchAsync(async (req, res, next) => {
  const newBrand = await Brand.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      brand: newBrand,
    },
  });
});

exports.updateBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    return next(new AppError("No brand found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      brand,
    },
  });
});

exports.deleteBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);

  if (!brand) {
    return next(new AppError("No brand found with this ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
