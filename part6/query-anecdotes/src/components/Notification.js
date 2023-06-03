import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const [{show, message}, dispatch] = useContext(NotificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!show) return null

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
