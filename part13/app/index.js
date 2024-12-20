const express = require("express");
require("express-async-errors");
const cors = require("cors");
const blogRouter = require("./routes/blog");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const authorRouter = require("./routes/author");
const readingListRouter = require("./routes/readingList");
const logoutRouter = require("./routes/logout");
const { connectToDatabase } = require("./utils/db");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", readingListRouter);

app.listen(3000, async () => {
  await connectToDatabase();
  console.log("listening on port 3000");
});
