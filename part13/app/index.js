const express = require("express");
const cors = require("cors");
const blogRouter = require("./routes/blog");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/blogs", blogRouter);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
