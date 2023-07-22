interface NotificationProps {
  notification: string;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}

const Notification = (props: NotificationProps) => {
  setTimeout(() => props.setNotification(""), 5000);
  return <div>{props.notification === "" ? null : props.notification}</div>;
};

export default Notification;
