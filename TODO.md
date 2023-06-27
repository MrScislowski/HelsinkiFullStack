

8.6: Adding a book
Implement mutation addBook, which can be used like this:

mutation {
  addBook(
    title: "NoSQL Distilled",
    author: "Martin Fowler",
    published: 2012,
    genres: ["database", "nosql"]
  ) {
    title,
    author
  }
}copy
The mutation works even if the author is not already saved to the server:

mutation {
  addBook(
    title: "Pimeyden tango",
    author: "Reijo Mäki",
    published: 1997,
    genres: ["crime"]
  ) {
    title,
    author
  }
}copy
If the author is not yet saved to the server, a new author is added to the system. The birth years of authors are not saved to the server yet, so the query

query {
  allAuthors {
    name
    born
    bookCount
  }
}copy
returns

{
  "data": {
    "allAuthors": [
      // ...
      {
        "name": "Reijo Mäki",
        "born": null,
        "bookCount": 1
      }
    ]
  }
}copy



8.7: Updating the birth year of an author
Implement mutation editAuthor, which can be used to set a birth year for an author. The mutation is used like so:

mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}copy
If the correct author is found, the operation returns the edited author:

{
  "data": {
    "editAuthor": {
      "name": "Reijo Mäki",
      "born": 1958
    }
  }
}copy
If the author is not in the system, null is returned:
{
  "data": {
    "editAuthor": null
  }
}