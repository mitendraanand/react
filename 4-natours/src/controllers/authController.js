const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  // CREATE USER
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  // CREATE TOKEN
  const token = jwt.sign(
    {
      id: newUser._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  // RESPOND TO CLIENT
  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});
