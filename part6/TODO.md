[ ] 6.10 Better anecdotes, step8
  Install Redux Toolkit for the project. Move the Redux store creation into the file store.js and use Redux Toolkit's configureStore to create the store.

  Change the definition of the filter reducer and action creators to use the Redux Toolkit's createSlice function.

  Also, start using Redux DevTools to debug the application's state easier.

[ ] 6.11 Better anecdotes, step9
Change also the definition of the anecdote reducer and action creators to use the Redux Toolkit's createSlice function.

[ ] 6.12 Better anecdotes, step10
The application has a ready-made body for the Notification component:

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      render here notification...
    </div>
  )
}

export default Notification


Extend the component so that it renders the message stored in the Redux store, making the component take the following form:

import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(/* something here */)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}
You will have to make changes to the application's existing reducer. Create a separate reducer for the new functionality by using the Redux Toolkit's createSlice function.

The application does not have to use the Notification component intelligently at this point in the exercises. It is enough for the application to display the initial value set for the message in the notificationReducer.

[ ] 6.13 Better anecdotes, step11
Extend the application so that it uses the Notification component to display a message for five seconds when the user votes for an anecdote or creates a new anecdote:

browser showing message of having voted
It's recommended to create separate action creators for setting and removing notifications.