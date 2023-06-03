import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SET":
            return {...state, message: action.payload}
        case "SHOW":
            return {...state, show: true}
        case "HIDE":
            return {...state, show: false}
        default:
            return state
    }
}


export const displayTimedNotification = (notificationDispatch, message, duration = 5) => {
    notificationDispatch({type: 'SET', payload: message})
    notificationDispatch({type: 'SHOW'})
    setTimeout(() => notificationDispatch({type: 'HIDE'}), duration * 1000)
  }
  

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, "")

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationContent = () => {
    const contentAndDispatch = useContext(NotificationContext)
    return contentAndDispatch[0]
}

export const useNotificationDispatch = () => {
    const contentAndDispatch = useContext(NotificationContext)
    return contentAndDispatch[1]
}

export default NotificationContext