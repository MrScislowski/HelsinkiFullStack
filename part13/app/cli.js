const Blog = require("./models/Blog");

const main = async () => {
  await Blog.sync();
  const blogs = await Blog.findAll();
  blogs.forEach((blog) => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
  });
};

main();
