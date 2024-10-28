const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const { User } = require("../models/index");

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

  const userForToken = { id: theUser.id, username: theUser.username };

  const token = jwt.sign(userForToken, config.SECRET);
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
