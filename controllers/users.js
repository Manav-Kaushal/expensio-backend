const jwt = require("jsonwebtoken");
const User = require("../models/user");

// @desc: Register user
// @route: POST /api/auth/register
// @access: Public
exports.createUser = async (req, res, next) => {
  const { name, password, email } = req.body;
  console.log("test", { name, password, email });

  if (name && password && email) {
    const emailAlreadyExists = await User.findOne({ email: email });
    if (emailAlreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists!",
      });
    }
    try {
      const user = await User.create({
        name,
        email,
        password,
      });
      if (user) {
        return res.status(200).json({
          message: "Registered!",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  } else {
    res.status(422).json({ message: "Please check the payload sent!" });
  }
};

// @desc: Add transactions
// @route: POST /api/v1/transactions
// @access: Public
exports.loginUser = async (req, res, next) => {
  const { password, email } = req.body;

  if (password && email) {
    const emailExists = await User.findOne({ email });

    if (!emailExists) {
      return res.status(404).json({
        message: "Email not found!",
      });
    }

    try {
      const user = await User.findOne({
        email,
        password,
      });
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      if (user.email === email && user.password === password) {
        const token = jwt.sign(userData, "someRandomSecret@123#");
        return res.status(200).json({
          message: "Logged in!",
          token,
          userData,
        });
      } else {
        return res.status(401).json({
          message: "Incorrect email or password!",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(422).json({ message: "Please check the payload sent!" });
  }
};
