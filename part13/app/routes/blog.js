const express = require("express");
const router = express.Router();

const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  const newBlog = await Blog.create(req.body);
  res.json(newBlog);
});

router.delete("/:id", async (req, res) => {
  const theBlog = await Blog.findByPk(req.params.id);

  if (!theBlog) {
    res.status(404).send();
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
    theBlog.likes = req.body.likes;
    await theBlog.save();
    res.status(200).send();
  }
});

module.exports = router;
