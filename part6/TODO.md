[ ] Exercise 6.24.
As stated in exercise 6.21, the server requires that the content of the anecdote to be added is at least 5 characters long. Now implement error handling for the insertion. In practice, it is sufficient to display a notification to the user in case of a failed POST request:

browser showing error notification for trying to add too short of an anecdoate
The error condition should be handled in the callback function registered for it, see here how to register a function.