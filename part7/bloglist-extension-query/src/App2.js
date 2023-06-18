import NotificationContext, {notificationActions} from "./reducers/NotificationContext";

import { useContext } from "react";

const App2 = (props) => {
  const [notification, notificationDispatch] = useContext(NotificationContext);

  // notificationDispatch({type:'SET_INFO', message: "hello"});

  return (
    <>
    <button onClick={() => notificationDispatch(notificationActions.displayInfoMessage(Math.random()*10))}> set notification to random number </button>
    <br></br>
    <button onClick={() => notificationDispatch(notificationActions.displayTimedInfoMessage(Math.random()*10))}> do a timed notification dispatch </button>

    <p>{JSON.stringify(notification)}</p>
    </>
  )
}

export default App2;