import axios from "axios";
import { useEffect, useState } from "react";
import { DiaryEntryData } from "./types";
import DiaryEntries from "./components/DiaryEntries";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntryData[]>([]);

  useEffect(() => {
    axios
      .get<DiaryEntryData[]>("http://localhost:3000/api/diaries")
      .then((res) => setEntries(res.data));
  }, []);

  if (entries.length === 0) {
    return <></>;
  }

  return (
    <>
      <h1>Flight Diary</h1>
      <DiaryEntries entries={entries} />
    </>
  );
};

export default App;
