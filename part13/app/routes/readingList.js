const express = require("express");
const router = express.Router();

const { ReadingList } = require("../models/index");

router.post("/", async (req, res) => {
  const response = await ReadingList.create(req.body);
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
