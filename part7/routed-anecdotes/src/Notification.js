import { useContext } from "react"
import NotificationContext from "./NotificationContext"

const Notification = (props) => {
    const [notification, setNotification] = useContext(NotificationContext)
    
    const style = notification === ''
        ? { display: "none" }
        : { border: "black" }

    setTimeout(() => setNotification(''), 5000)

    return (
        <div style={style}>
            {notification}
        </div>
    )
}

export default Notification