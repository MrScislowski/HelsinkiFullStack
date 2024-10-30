const express = require("express");
const router = express.Router();

const { User, Blog, ReadingList } = require("../models/index");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: {
          exclude: ["userId"],
        },
      },
      {
        model: Blog,
        as: "bookmarked_blogs",
        through: {
          attributes: [],
        },
      },
    ],
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: "bookmarked_blogs",
      through: {
        attributes: [],
      },
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.json(user);
});

router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
});

router.put("/:username", async (req, res) => {
  const theUser = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (!theUser) {
    return res.status(404).send();
  }

  theUser.username = req.body.username;
  const updatedUser = await theUser.save();
  res.status(200).json(updatedUser);
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
