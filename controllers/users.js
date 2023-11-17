const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// @desc: Register user
// @route: POST /api/auth/register
// @access: Public
exports.createUser = async (req, res, next) => {
  const { name, password, email } = req.body;

  if (name && password && email) {
    const emailAlreadyExists = await User.findOne({ email: email });
    if (emailAlreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists!",
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      if (user) {
        return res.status(200).json({
          message: "Registered!",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: e?.message || "Server Error",
      });
    }
  } else {
    res.status(422).json({ message: "Please check the payload sent!" });
  }
};

// @desc: Login user
// @route: POST /api/login
// @access: Public
exports.loginUser = async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      message: "Please check the payload sent!",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email not found!",
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (email === user.email && passwordsMatch) {
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.name,
      };
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
    console.log({ error });
    return res.status(500).json({
      message: error.message,
    });
  }
};
