import { useEffect, useState } from "react";
import { FlightDetailsSafe } from "./types";
import axios from "axios";

const App = () => {
  const [entries, setEntries] = useState<FlightDetailsSafe[]>([]);

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
  }, [entries]);

  return (
    <ul>
      {entries.map((entry) => {
        return (
          <li key={entry.id}>
            {entry.date}: {entry.weather} weather {entry.visibility} visibility
          </li>
        );
      })}
    </ul>
  );
};

export default App;
