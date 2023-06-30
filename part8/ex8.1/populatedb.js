const config = require("./config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Author = require("./models/author");
const Book = require("./models/book");

const MONGODB_URI = config.DB_URL;
console.log(`connecting to ${MONGODB_URI}`);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const doPopulateDb = async () => {
  const author = await Author.create({ name: "Daniel Scislowski", born: 1986 });

  const book = await Book.create({
    title: "broma",
    author: author,
    genres: ["fake"],
    published: 1977,
  });

  console.log(book);
};

doPopulateDb().then("did the function!");
