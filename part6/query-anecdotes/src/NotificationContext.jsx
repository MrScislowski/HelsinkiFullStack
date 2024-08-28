import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'HIDE':
      return ''
    default:
      return state
  }
}

export const showNotification = (message) => {
  return { type: 'SHOW', payload: message }
}

export const hideNotification = (message) => {
  return { type: 'HIDE' }
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