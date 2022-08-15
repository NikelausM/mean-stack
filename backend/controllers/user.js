const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      password: hash
    });
    const result = await user.save();

    res.status(201).json({
      message: 'User created!',
      result: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Invalid authentication credentials!"
    });
  }
};

exports.loginUser = async (req, res, next) => {
  const authFail = (postFix) => {
    message = !!postFix ? `Auth failed: ${postFix}!` : "Auth failed!";
    return res.status(401).json({
      message: message
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return authFail("E-mail or password incorrect")
    }

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return authFail("E-mail or password incorrect")
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h'
      }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    })
  } catch (error) {
    return authFail();
  }
};