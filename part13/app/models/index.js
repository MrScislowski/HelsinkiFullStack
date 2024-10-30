const User = require("./User");
const Blog = require("./Blog");
const ReadingList = require("./ReadingList");

User.hasMany(Blog);
Blog.belongsTo(User);

// From a natural language perspective, it amkes more sense to say "blog belongs to many user as a reading list".
// But actually, maybe the "as" is going with the "user" part... in which case, "blog belongs to many user. The user is a blog_reader"
Blog.belongsToMany(User, { through: ReadingList, as: "blog_reader" });
// Similarly, "user belongs to many blogs. These blogs are their bookmarked blogs"
User.belongsToMany(Blog, { through: ReadingList, as: "bookmarked_blogs" });

module.exports = { User, Blog, ReadingList };
