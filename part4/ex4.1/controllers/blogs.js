const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const res = require("express/lib/response");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  response.json(await Blog.find({}).populate("user"));
});

blogsRouter.post("/", async (request, response) => {
  if (!request.body.title && !request.body.url) {
    return response.status(400).end();
  }

  if (!request.token) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const curUser = await User.findById(decodedToken.id);

  const blog = new Blog({
    likes: request.body.likes ? request.body.likes : 0,
    user: curUser.id,
    ...request.body,
  });

  const result = await blog.save();
  curUser.blogs = curUser.blogs.concat(result._id);
  await curUser.save();
  response.status(201).json(result);
});

blogsRouter.delete("/all", async (request, response) => {
  const retVal = await Blog.deleteMany({});
  response.status(200).json(retVal);
});

blogsRouter.delete("/:id", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "must be logged in to do this" });
  }

  const theBlogPost = await Blog.findById(request.params.id);
  if (!theBlogPost) {
    return response.status(404).end();
  }

  if (theBlogPost.user.toString() !== request.user.id.toString()) {
    return response
      .status(401)
      .json({ error: "you must own this blog post to delete it" });
  }

  const retVal = await Blog.findByIdAndRemove(request.params.id);

  response.status(200).json(retVal);
});

blogsRouter.put("/fillInitial", async (request, response) => {});

blogsRouter.put("/:id", async (request, response) => {
  // const amendedBlog = (({title, author, url, likes, user}) => ({title, author, url, likes, user}))(request.body)
  const amendedBlog = (({ title, author, url, likes, user }) => ({
    title,
    author,
    url,
    likes,
    user,
  }))(request.body); // this line just strips the blog id off the request body
  const retVal = await Blog.findByIdAndUpdate(request.params.id, amendedBlog, {
    runValidators: true,
    returnDocument: "after",
  });
  if (retVal) {
    response.status(201).json(retVal);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const commentText = request.body.comment;
  console.dir(request.body)
  const selectedBlog = await Blog.findById(request.params.id);
  if (!selectedBlog.comments) {
    selectedBlog.comments = [commentText];
  } else {
    selectedBlog.comments.push(commentText);
  }

  const retVal = await Blog.findByIdAndUpdate(request.params.id, selectedBlog, {
    runValidators: true,
    returnDocument: "after",
  });

  if (retVal) {
    response.status(201).json(retVal);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
