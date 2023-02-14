const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function restrictToLoggedInUserOnly(req, res, next) {
  const token = req.headers.token;

  if (!token) return res.status(401).send({ message: "No auth token found!" });

  const { id } = jwt.decode(token, "secret@123#");

  const user = await User.findOne({ id });

  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
};
