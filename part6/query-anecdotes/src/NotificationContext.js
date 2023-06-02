import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SET":
            return action.payload
        case "UNSET":
            return ""
        default:
            return state
    }
}

export const NotificationContextProvider = (props) => {
    
    const [notification, notificationDispatch] = useReducer(notificationReducer, "")

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )

}

export const displayNotification = message => {
    const [notification, notificationDispatch] = useContext(NotificationContext)
    notificationDispatch({ type: 'SET', payload: message })
    setTimeout(() => notificationDispatch({ type: 'UNSET' }), 5000)
}

export default NotificationContext