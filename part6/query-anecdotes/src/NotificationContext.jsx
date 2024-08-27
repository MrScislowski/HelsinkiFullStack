import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  console.log('notificaton reducer called...')
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'HIDE':
      return ''
    default:
      return state
  }
}

// export const showNotification = (message) => {
//   return { type: 'SHOW', payload: message }
// }

export const showNotification = (message) => {
  console.log('returning the async function for shownotification')
  return async (dispatch) => {
    console.log('async function for notification has been called...')
    dispatch({ type: 'SHOW', payload: message })
    setTimeout(() => dispatch({type: 'HIDE'}), 3000)
  }
}


const NotificationContext = createContext()

export const useNotificationValue = () => {
  const [notification, _] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const [_, dispatch] = useContext(NotificationContext)
  return dispatch
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
  <NotificationContext.Provider value={ [notification, notificationDispatch] }>
    {props.children}
  </NotificationContext.Provider>
  )
}

export default NotificationContext