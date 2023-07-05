https://fullstackopen.com/en/part8/login_and_updating_the_cache#exercises-8-17-8-22

8.17 Listing books
After the backend changes, the list of books does not work anymore. Fix it.

8.18 Log in
Adding new books and changing the birth year of an author do not work because they require a user to be logged in.

Implement login functionality and fix the mutations.

It is not necessary yet to handle validation errors.

You can decide how the login looks on the user interface. One possible solution is to make the login form into a separate view which can be accessed through a navigation menu:

browser books showing login button highlighted
The login form:

browser showing login form
When a user is logged in, the navigation changes to show the functionalities which can only be done by a logged-in user:

browser showing addbook and logout buttons
8.19 Books by genre, part 1
Complete your application to filter the book list by genre. Your solution might look something like this:

browser showing books buttons down at the bottom
In this exercise, the filtering can be done using just React.

8.20 Books by genre, part 2
Implement a view which shows all the books based on the logged-in user's favourite genre.

browser showing two books via patterns
8.21 books by genre with GraphQL
In the previous two exercises, the filtering could have been done using just React. To complete this exercise, you should redo the filtering the books based on a selected genre (that was done in exercise 8.19) using a GraphQL query to the server. If you already did so then you do not have to do anything.

This and the next exercises are quite challenging like it should be this late in the course. You might want to complete first the easier ones in the next part.

8.22 Up-to-date cache and book recommendations
If you did the previous exercise, that is, fetch the books in a genre with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated at least when a genre selection button is pressed.

When new genre selection is not done, the view does not have to be updated.
