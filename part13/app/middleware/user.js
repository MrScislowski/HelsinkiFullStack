const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const Session = require("../models/Session");

const getUserFromToken = async (req, res, next) => {
  let userFromToken;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.match("^[Bb]earer ")
  ) {
    const token = req.headers.authorization.substring(7);
    userFromToken = jwt.verify(token, config.SECRET);

    req.user = userFromToken;
  } else {
    throw new Error("Must be logged in and provide token to make a post");
  }

  const result = await Session.findAndCountAll({
    userId: userFromToken.id,
    sessionId: userFromToken.sessionId,
  });

  if (result.count !== 1) {
    throw new Error("Session invalid");
  }

  next();
};

module.exports = { getUserFromToken };
