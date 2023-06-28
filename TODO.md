https://fullstackopen.com/en/part8/react_and_graph_ql#exercises-8-8-8-12

[ ]8.8: Authors view
Implement an Authors view to show the details of all authors on a page as follows:

browser showing 5 authors with the buttons
[ ]8.9: Books view
Implement a Books view to show on a page all other details of all books except their genres.

browser showing 7 books with the button
[ ]8.10: Adding a book
Implement a possibility to add new books to your application. The functionality can look like this:

browser showing the add book form with data fulfilled
Make sure that the Authors and Books views are kept up to date after a new book is added.

In case of problems when making queries or mutations, check from the developer console what the server response is:

browser unhandled rejection and dev tools network and preview highlighted showing error message
[ ]8.11: Authors birth year
Implement a possibility to set authors birth year. You can create a new view for setting the birth year, or place it on the Authors view:

browser showing born input text field year
Make sure that the Authors view is kept up to date after setting a birth year.

[ ]8.12: Authors birth year advanced
Change the birth year form so that a birth year can be set only for an existing author. Use select tag, react select, or some other mechanism.

A solution using the react select library looks as follows:
browser showing set birthyear option for existing name
