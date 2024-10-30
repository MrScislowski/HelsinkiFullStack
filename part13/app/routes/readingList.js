const express = require("express");
const router = express.Router();
const { getUserFromToken } = require("../middleware/user");

const { ReadingList } = require("../models/index");

router.get("/", async (req, res) => {
  const response = await ReadingList.findAll();
  res.json(response);
});

router.post("/", async (req, res) => {
  const response = await ReadingList.create(req.body);
  res.json(response);
});

router.put("/:id", getUserFromToken, async (req, res) => {
  const entry = await ReadingList.findByPk(req.params.id);

  if (req.user.id !== entry.userId) {
    throw new Error("you can only mark your own blogs as read");
  }

  entry.read = req.body.read;

  const response = await entry.save();
  res.json(response);
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
