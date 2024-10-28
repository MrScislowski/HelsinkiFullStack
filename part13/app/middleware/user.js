const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const getUserFromToken = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.match("^[Bb]earer ")
  ) {
    const token = req.headers.authorization.substring(7);
    const userFromToken = jwt.verify(token, config.SECRET);
    req.user = userFromToken;
  } else {
    throw new Error("Must be logged in and provide token to make a post");
  }
  next();
};

module.exports = { getUserFromToken };
