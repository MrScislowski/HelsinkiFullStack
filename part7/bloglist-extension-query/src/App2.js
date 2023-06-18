import { NotificationContext} from "./reducers/NotificationContext";
import { useContext } from "react";

const App2 = (props) => {
  const notification = useContext(NotificationContext);

  // notificationDispatch({type:'SET_INFO', message: "hello"});

  return (
    <>
    <button onClick={() => notification.displayTimedInfoMessage(Math.random()*10)}> set notification to random number </button>

    <p>{JSON.stringify(notification)}</p>
    </>
  )
}

export default App2;