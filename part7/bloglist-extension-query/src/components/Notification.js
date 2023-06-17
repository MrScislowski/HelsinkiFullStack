import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

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
