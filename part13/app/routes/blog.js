const express = require("express");
const router = express.Router();

const { Blog, User } = require("../models/index");
const { getUserFromToken } = require("../middleware/user");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    include: { model: User },
  });
  res.json(blogs);
});

router.post("/", getUserFromToken, async (req, res) => {
  const newBlog = await Blog.create({ ...req.body, userId: req.user.id });
  res.json(newBlog);
});

router.delete("/:id", getUserFromToken, async (req, res) => {
  const theBlog = await Blog.findByPk(req.params.id);

  if (!theBlog) {
    res.status(404).send();
  } else if (theBlog.userId !== req.user.id) {
    throw new Error("You can only delete blogs that you posted");
  } else {
    await theBlog.destroy();
    res.status(204).send();
  }
});

router.put("/:id", async (req, res) => {
  let theBlog = await Blog.findByPk(req.params.id);

  if (!theBlog) {
    res.status(404).send();
  } else {
    if (!Number.isInteger(req.body.likes)) {
      throw new Error(
        "'likes' property must be specified, and must be an integer"
      );
    }
    theBlog.likes = req.body.likes;
    await theBlog.save();
    res.status(200).send();
  }
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
