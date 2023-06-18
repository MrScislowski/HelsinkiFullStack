import { useContext } from "react";
import NotificationContext from "../reducers/NotificationContext";


const Notification = () => {

  const notification = useContext(NotificationContext);

  if (notification.notification.type === null) {
    return <></>;
  }

  return (
    <>
      <p className={notification.notification.type}>{notification.notification.message}</p>
    </>
  );
};

export default Notification;
