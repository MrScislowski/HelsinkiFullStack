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
    doPopulateDb().then("did the function!");
    console.log("db populated");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const doPopulateDb = async () => {
  await Author.deleteMany({});
  await Book.deleteMany({});

  const author1 = await Author.create({
    name: "Daniel Scislowski",
    born: 1986,
  });
  const author2 = await Author.create({ name: "Blaise Pascal", born: 1610 });
  const author3 = await Author.create({ name: "Roddy Doyle", born: 1958 });

  const book1 = await Book.create({
    title: "broma",
    author: author1,
    genres: ["fake", "nonsense"],
    published: 1977,
  });

  const book2 = await Book.create({
    title: "second title",
    author: author1,
    genres: ["fake", "drama"],
    published: 2020,
  });

  const book3 = await Book.create({
    title: "Pensees",
    author: author2,
    genres: ["religion", "philosophy"],
    published: 1660,
  });

  const book4 = await Book.create({
    title: "The Commitments",
    author: author3,
    genres: ["rock", "comedy"],
    published: 1989,
  });

  return true;
};
