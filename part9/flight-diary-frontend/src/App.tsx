import { useEffect, useState } from "react";
import { DiaryEntryData } from "./types";
import DiaryEntries from "./components/DiaryEntries";
import diaryService from "./services/diaryService";
import AddEntryForm from "./components/AddEntryForm";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntryData[]>([]);

  useEffect(() => {
    diaryService.getAll().then((data) => setEntries(data));
  }, []);

  if (entries.length === 0) {
    return <></>;
  }

  return (
    <>
      <h1>Flight Diary</h1>
      <AddEntryForm entries={entries} setEntries={setEntries} />
      <DiaryEntries entries={entries} />
    </>
  );
};

export default App;
