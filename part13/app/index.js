const express = require("express");
const cors = require("cors");
const BlogInit = require("./models/Blog");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  const newBlog = await Blog.create(req.body);
  res.json(newBlog);
});

app.delete("/api/blogs/:id", async (req, res) => {
  const theBlog = await Blog.findByPk(req.params.id);

  if (!theBlog) {
    res.status(404).send();
  } else {
    await theBlog.destroy();
    res.status(204).send();
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
