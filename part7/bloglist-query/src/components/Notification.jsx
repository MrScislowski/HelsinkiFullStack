import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  if (notification === null) return [];

  const notificationData = () => {
    return (
      <ul>
        {Object.entries(notification.data).map(([k, v]) => {
          return (
            <li key={k}>
              {k}: {v}
            </li>
          );
        })}
      </ul>
    );
  };

  const infoStyle = {
    padding: 10,
    backgroundColor: "green",
    color: "white",
    borderStyle: "solid",
  };

  const errorStyle = {
    padding: 10,
    backgroundColor: "red",
    color: "white",
    borderStyle: "solid",
  };

  let chosenStyle = infoStyle;

  if (notification.type === "info") {
    chosenStyle = infoStyle;
  } else if (notification.type === "error") {
    chosenStyle = errorStyle;
  }

  return (
    <div id="notification" data-testid="notification" style={chosenStyle}>
      <p>{notification.message}</p>
      {notification.data && notificationData()}
    </div>
  );
};

export default Notification;
