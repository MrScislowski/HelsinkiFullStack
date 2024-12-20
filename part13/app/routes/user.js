const express = require("express");
const router = express.Router();
const { getUserFromToken } = require("../middleware/user");

const { User, Blog, ReadingList, Session } = require("../models/index");
const { where } = require("sequelize");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: {
          exclude: ["userId"],
        },
      },
    ],
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  let filterConditions = {};

  if (req.query?.read != null) {
    filterConditions.read = req.query.read;
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: "bookmarked_blogs",
        through: {
          attributes: [],
        },
        attributes: {
          exclude: ["userId"],
        },
        include: {
          model: ReadingList,
          where: {
            userId: req.params.id,
            ...filterConditions,
          },
          attributes: ["id", "read"],
        },
      },
    ],
  });
  res.json(user);
});

router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
});

router.post("/disable", getUserFromToken, async (req, res) => {
  await Session.destroy({
    where: { user_id: req.user.id },
  });

  await User.update({ disabled: true }, { where: { id: req.user.id } });

  res.status(200).send("account disabled");
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
