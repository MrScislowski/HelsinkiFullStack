https://fullstackopen.com/en/part8/database_and_user_administration#exercises-8-13-8-16

Exercises 8.13.-8.16
The following exercises are quite likely to break your frontend. Do not worry about it yet; the frontend shall be fixed and expanded in the next chapter.

8.13: Database, part 1
Change the library application so that it saves the data to a database. You can find the mongoose schema for books and authors from here.

Let's change the book graphql schema a little

type Book {
title: String!
published: Int!
author: Author!
genres: [String!]!
id: ID!
}copy
so that instead of just the author's name, the book object contains all the details of the author.

You can assume that the user will not try to add faulty books or authors, so you don't have to care about validation errors.

The following things do not have to work just yet:

allBooks query with parameters
bookCount field of an author object
author field of a book
editAuthor mutation
Note: despite the fact that author is now an object within a book, the schema for adding a book can remain same, only the name of the author is given as a parameter

type Mutation {
addBook(
title: String!
author: String!
published: Int!
genres: [String!]!
): Book!
editAuthor(name: String!, setBornTo: Int!): Author
}copy
8.14: Database, part 2
Complete the program so that all queries (to get allBooks working with the parameter author and bookCount field of an author object is not required) and mutations work.

Regarding the genre parameter of the all books query, the situation is a bit more challenging. The solution is simple, but finding it can be a headache. You might benefit from this.

8.15 Database, part 3
Complete the program so that database validation errors (e.g. book title or author name being too short) are handled sensibly. This means that they cause GraphQLError with a suitable error message to be thrown.

8.16 user and logging in
Add user management to your application. Expand the schema like so:

type User {
username: String!
favoriteGenre: String!
id: ID!
}

type Token {
value: String!
}

type Query {
// ..
me: User
}

type Mutation {
// ...
createUser(
username: String!
favoriteGenre: String!
): User
login(
username: String!
password: String!
): Token
}copy
Create resolvers for query me and the new mutations createUser and login. Like in the course material, you can assume all users have the same hardcoded password.

Make the mutations addBook and editAuthor possible only if the request includes a valid token.

(Don't worry about fixing the frontend for the moment.)
