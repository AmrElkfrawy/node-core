const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const handlerFactory = require("./handlerFactory");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ObjectId = require("mongoose").Types.ObjectId;

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    user: req.user._id,
    _id: req.params.cartId,
  });

  if (!cart) {
    return next(
      new AppError(`There is no cart for this user with this id`, 404)
    );
  }

  if (!req.body.firstName)
    return next(new AppError("First name is required", 400));
  if (!req.body.lastName)
    return next(new AppError("Last name is required", 400));
  if (!req.body.phone) return next(new AppError("Phone is required", 400));
  let shippingAddress = {};
  if (req.body.shippingAddress) {
    if (!shippingAddress.country)
      return next(new AppError("Country is required", 400));
    if (!shippingAddress.address)
      return next(new AppError("Address is required", 400));
    if (!shippingAddress.governorate)
      return next(new AppError("Governorate is required", 400));
    if (!shippingAddress.city)
      return next(new AppError("City is required", 400));
    if (!shippingAddress.postCode)
      return next(new AppError("Post code is required", 400));
  } else {
    if (req.user.addresses.length === 0) {
      return next(
        new AppError(
          `Please provide shipping address when creating an order, or in your profile`,
          400
        )
      );
    }
    shippingAddress.address = req.user.addresses[0]._id;
  }

  const items = cart.cartItems.map((item) => {
    if (item.quantity > item.product.quantity) {
      return next(new AppError("Not enough quantity in stock", 400));
    }
    return {
      price_data: {
        unit_amount:
          item.product.price * (1 - item.product.discount / 100) * 100,
        currency: "usd",
        product_data: {
          name: item.product.name,
        },
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get(
      "host"
    )}/api/v1/orders/create/?cartId=${req.params.cartId}&userId=${
      req.user._id
    }&price=${cart.totalPriceAfterDiscount}&country=${
      shippingAddress.country
    }&address=${shippingAddress.address}&governorate=${
      shippingAddress.governorate
    }&city=${shippingAddress.city}&postCode=${
      shippingAddress.postCode
    }&firstName=${req.body.firstName}&lastName=${req.body.lastName}&phone=${
      req.body.phone
    }`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/products`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    line_items: items,

    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1000,
            currency: "usd",
          },
          display_name: "Shipping takes 5-7 days",
        },
      },
    ],
    mode: "payment",
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  const {
    cartId,
    userId,
    price,
    country,
    address,
    governorate,
    city,
    postCode,
    firstName,
    lastName,
    phone,
  } = req.query;
  if (!cartId || !userId || !price || !address) {
    return next();
  }
  const cart = await Cart.findOne({
    user: userId,
    _id: cartId,
  });

  if (!cart) {
    return next(
      new AppError(`There is no cart for this user with this id`, 404)
    );
  }
  let adres;

  if (ObjectId.isValid(address)) {
    adres = await User.findOne({ _id: userId, "addresses._id": address });
  } else {
    adres = { addresses: [{ country, address, governorate, city, postCode }] };
  }
  console.log(firstName, lastName, phone, adres.addresses[0]);
  await Order.create({
    user: userId,
    firstName,
    lastName,
    phone,
    products: cart.cartItems,
    totalPrice: price,
    shippingAddress: adres.addresses[0],
    paymentStatus: "Paid",
    paymentMethodType: "card",
    shippingPrice: 10,
  });

  const updatePromises = await Promise.all(
    cart.cartItems.map(async (item) => {
      return await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: { quantity: -item.quantity, sold: +item.quantity },
        },
        { new: true }
      );
    })
  );

  // console.log(updatePromises);
  await Cart.findByIdAndDelete(cartId);

  const newUrl = `${req.originalUrl.split("create")[0]}`.replace(
    "orders",
    "products"
  );
  res.redirect(newUrl);
});

exports.getOrder = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.user.role === "user") filter = { user: req.user._id };
  const order = await Order.findOne({ _id: req.params.id, ...filter });
  if (req.user.role === "user" && !order)
    return next(new AppError("You don't have an order with this id", 404));
  if (req.user.role === "admin" && !order)
    return next(new AppError("There is no order with this id", 404));

  res.status(200).json({
    status: "success",
    order,
  });
});

exports.filterOrders = (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
};

exports.filterBody = (req, res, next) => {
  const filteredBody = {};
  if (req.body.hasOwnProperty("status")) {
    filteredBody.status = req.body.status;
  }
  if (req.body.hasOwnProperty("paymentStatus")) {
    filteredBody.paymentStatus = req.body.paymentStatus;
  }
  if (req.body.hasOwnProperty("paymentMethodType")) {
    filteredBody.paymentMethodType = req.body.paymentMethodType;
  }
  req.body = filteredBody;
  next();
};

exports.getAllOrders = handlerFactory.getAll(Order);
exports.deleteOrder = handlerFactory.deleteOne(Order);
exports.updateOrder = handlerFactory.updateOne(Order);

// http://127.0.0.1:5000/api/v1/orders/create/?cartId=6642c20b51b856da7f4bc49e&userId=5c8a201e2f8fb814b56fa186&price=526.24&country=Egy&address=sd
