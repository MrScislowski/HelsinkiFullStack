const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
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
