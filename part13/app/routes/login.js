const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { v1 } = require("uuid");

const { User, Session } = require("../models/index");

router.post("/", async (req, res) => {
  const username = req.body.username;
  const theUser = await User.findOne({
    where: {
      username: username,
    },
  });
  const password = req.body.password;

  if (!theUser || password !== "secret") {
    return res.status(400).send("invalid username or password");
  }

  if (theUser.disabled) {
    return res.status(400).send("this user's account is disabled");
  }

  const sessionId = v1();

  const userForToken = {
    id: theUser.id,
    username: theUser.username,
    sessionId,
  };

  const token = jwt.sign(userForToken, config.SECRET);

  await Session.create({ userId: theUser.id, sessionId });

  return res.status(200).json({
    token,
    id: userForToken.id,
    username: userForToken.username,
    name: theUser.name,
  });
});

const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(400).send(err.message);
  }

  console.error(err);
  return res.status(500).send();
};

router.use(errorHandler);

module.exports = router;
