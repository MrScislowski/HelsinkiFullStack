const { connectToDatabase, sequelize } = require("./db");
const { Blog, User } = require("../models/index");

const main = async () => {
  await connectToDatabase();

  await User.bulkCreate(
    [
      {
        name: "Ali Brown",
        username: "user1@example.com",
      },
      {
        name: "Charlie Dreyfus",
        username: "user2@example.com",
      },
    ],
    {
      validate: true,
    }
  );

  await Blog.bulkCreate(
    [
      {
        author: "Charles Eisenstein",
        url: "https://charleseisenstein.org/essays/the-coronation/",
        title: "The Coronation",
        userId: 1,
      },
      {
        author: "Nate Silver",
        url: "https://www.natesilver.net/p/the-border-may-tip-the-election-to",
        title: "The border may tip the election to Trump",
        likes: 250,
        userId: 2,
      },
      {
        author: "Matt Yglesias",
        url: "https://www.slowboring.com/p/bidens-foreign-policy-disappointment",
        title: "Biden's foreign policy disappointment",
        likes: 136,
        userId: 1,
      },
      {
        author: "Nate Silver",
        url: "https://www.natesilver.net/p/trumps-dominating-the-news-again",
        title:
          "Trump's dominating the news again. Maybe that's good news for Harris.",
        likes: 350,
        userId: 1,
      },
    ],
    {
      validate: true,
    }
  );
};

main()
  .then(() => sequelize.close())
  .then(() => console.log("done"));
