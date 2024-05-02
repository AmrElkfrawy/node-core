const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const multer = require("multer");
const sharp = require("sharp");

const fileStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please only upload images.", 400), false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });
exports.uploadProductPhoto = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

// exports.test = upload.array('images', 5);

exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // upload cover
  if (req.files.imageCover) {
    req.body.imageCover = `product-${req.user.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/products/${req.body.imageCover}`);
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const imageName = `product-${req.user.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryID;
  next();
};

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.updateProduct = catchAsync(async (req, res, next) => {
  if (req.body.editedImages) {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("No product found with this ID", 404));
    }

    for (let i = 0; i < Math.min(3, req.body.editedImages.length); i++) {
      if (![0, 1, 2].includes(parseInt(req.body.editedImages[i]))) {
        req.body.editedImages[i] = i;
      }
      product.images[parseInt(req.body.editedImages[i])] = req.body.images[i];
    }
    req.body.images = product.images;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("No product found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});
