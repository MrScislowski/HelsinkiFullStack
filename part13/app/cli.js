require("dotenv").config();
const { Sequelize } = require("sequelize");
const BlogInit = require("./models/BlogInit");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const Blog = BlogInit(sequelize);

const main = async () => {
  await Blog.sync();
  const blogs = await Blog.findAll();
  blogs.forEach((blog) => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
  });
};

main();
