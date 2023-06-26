import { useContext } from "react";
import NotificationContext from "../reducers/NotificationContext";
import { Notification as MantineNotification } from "@mantine/core";


const Notification = () => {

  const notification = useContext(NotificationContext);

  if (notification.notification.type === null) {
    return <></>;
  }

  return (
    <>
      <MantineNotification color={notification.notification.type === 'error' ? "red" : "teal"}>{notification.notification.message}</MantineNotification>
    </>
  );
};

export default Notification;
