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