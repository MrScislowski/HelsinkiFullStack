[ ] 6.18 Anecdotes and the backend, step5
Voting does not yet save changes to the backend. Fix the situation with the help of the Redux Thunk library.

[ ] 6.19 Anecdotes and the backend, step6
The creation of notifications is still a bit tedious since one has to do two actions and use the setTimeout function:

dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
Make an action creator, which enables one to provide the notification as follows:

dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
The first parameter is the text to be rendered and the second parameter is the time to display the notification given in seconds.

Implement the use of this improved notification in your application.