const express = require("express");
const router = express.Router();

const { Session } = require("../models/index");
const { getUserFromToken } = require("../middleware/user");

router.delete("/", getUserFromToken, async (req, res) => {
  await Session.destroy({
    where: { sessionId: req.user.sessionId, userId: req.user.id },
  });
  res.status(204).send();
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
