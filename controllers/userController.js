import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import SerpApi from 'google-search-results-nodejs'

const userRegister = asyncHandler(async (req, res) => {
  const { firstName, email, password } = req.body;

  // check if email exists in db
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error('User already exists');
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
    throw new Error('Invalid user data');
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user email exists in db
  const user = await User.findOne({ email });

  // return user obj if their password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      userToken: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // req.user was set in authMiddleware.js
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


const getSearchGoogle = asyncHandler(async (req, res) => {
  // req.user was set in authMiddleware.js
 // const user = await User.findById(req.user._id);

 let {body}= req;

  let search = new SerpApi.GoogleSearch("b03da059d2f1aaa25a8f9f0dd1ff49ccc72408a669b77ca4881a793f44a58e6b")
  console.log({})
  let result = search.json({
    q: body.keyword,            // search query
    location: "Austin, TX", // location 
   }, (data) => {
     console.log(data)
   })

   res.json({result});

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

export { userRegister, userLogin, getUserProfile, getSearchGoogle };
