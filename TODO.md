https://fullstackopen.com/en/part8/database_and_user_administration#exercises-8-13-8-16

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
