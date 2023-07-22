import { useEffect, useState } from "react";
import { FlightDetailsSafe } from "./types";
import DiaryEntriesList from "./DiaryEntriesList";
import axios from "axios";
import AddDiaryEntryForm from "./AddDiaryEntryForm";
import Notification from "./Notification";

const App = () => {
  const [entries, setEntries] = useState<FlightDetailsSafe[]>([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    axios
      .get<FlightDetailsSafe[]>("http://localhost:3000/api/diaries")
      .then((response) => {
        setEntries(response.data);
      })
      .catch((e) => {
        console.log("error occurred. See error details below: ");
        console.dir(e);
      });
  }, []);

  const addEntry = (entry: FlightDetailsSafe) => {
    setEntries([...entries, entry]);
  };

  return (
    <>
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <h2>Add Diary Entry</h2>
      <AddDiaryEntryForm
        addEntry={addEntry}
        setNotification={setNotification}
      />
      <h2>Diary Entries</h2>
      <DiaryEntriesList entries={entries} />
    </>
  );
};

export default App;
