import { useContext } from "react";
import NotificationContext from "../reducers/NotificationContext";


const Notification = () => {

  const [notification, notificationDispatch] = useContext(NotificationContext);

  if (notification.type === null) {
    return <></>;
  }

  return (
    <>
      <p className={notification.type}>{notification.message}</p>
    </>
  );
};

export default Notification;
