const express = require("express");
require("express-async-errors");
const cors = require("cors");
const blogRouter = require("./routes/blog");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
