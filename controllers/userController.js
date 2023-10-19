import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Seo from "../models/urlSeoModel.js";
import generateToken from "../utils/generateToken.js";
import SerpApi from "google-search-results-nodejs";
import Client from "../models/clientModel.js";

const userRegister = asyncHandler(async (req, res) => {
  const { firstName, email, password } = req.body;

  // check if email exists in db
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  // create new user document in db
  const user = await User.create({ firstName, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user email exists in db
  const user = await User.findOne({ email });

  // return user obj if their password matches
  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      data: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        userToken: generateToken(user._id),
      },
      message: "Te has logueado correctamente",
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // req.user was set in authMiddleware.js
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getSearchGoogle = asyncHandler(async (req, res) => {
  // req.user was set in authMiddleware.js
  // const user = await User.findById(req.user._id);

  let { body } = req;

  let search = new SerpApi.GoogleSearch(
    "b03da059d2f1aaa25a8f9f0dd1ff49ccc72408a669b77ca4881a793f44a58e6b"
  );
  console.log({});
  let result = search.json(
    {
      q: body.keyword, // search query
      location: "Austin, TX", // location
    },
    (data) => {
      console.log(data);
    }
  );

  res.json({ result });

  // if (user) {
  //   res.json({
  //     id: user._id,
  //     firstName: user.firstName,
  //     email: user.email,
  //   });
  // } else {
  //   res.status(404);
  //   throw new Error('User not found');
  // }
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    console.log("req: ", req.params.id);
    const products = await Product.find({ user: req.params.id });
    res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, brand, category, price, userId } =
      await req.body;
    const user = await User.findById(userId);
    if (user) {
      const newProduct = new Product({
        title,
        description,
        brand,
        category,
        price,
        user: user.id,
      });
      await newProduct.save();
      return res.json(newProduct);
    }
    return res.status(404).json({});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      brand,
      category,
      price,
      userId: user,
      _id,
    } = await req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: _id },
      { title, description, brand, category, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Do not update", updatedProduct });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const product = await Product.findOne({ _id: req.body._id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



export {
  userRegister,
  userLogin,
  getUserProfile,
  getSearchGoogle,
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
