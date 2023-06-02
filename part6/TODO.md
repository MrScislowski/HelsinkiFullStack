TODO: is it possible to keep 'displayNotification' entirely in its own file, without other files using bloody dispatch...? I feel annoyed at reducers right now. Like, it feels like I could use useState with context and be better off...
I don't like their solution where their Button has to have type with Magic Values 'INC', etc, and call dispatch(type)...

[ ] Exercise 6.23.
The application has a Notification component for displaying notifications to the user.

Implement the application's notification state management using the useReducer hook and context. The notification should tell the user when a new anecdote is created or an anecdote is voted on:

browser showing notification for added anecdote
The notification is displayed for five seconds.

[ ] Exercise 6.24.
As stated in exercise 6.21, the server requires that the content of the anecdote to be added is at least 5 characters long. Now implement error handling for the insertion. In practice, it is sufficient to display a notification to the user in case of a failed POST request:

browser showing error notification for trying to add too short of an anecdoate
The error condition should be handled in the callback function registered for it, see here how to register a function.