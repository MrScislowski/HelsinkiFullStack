import { DiaryEntryData } from "../types";

interface DiaryEntriesProps {
  entries: DiaryEntryData[];
}

const DiaryEntries = ({ entries }: DiaryEntriesProps) => {
  return (
    <>
      <h2>Entries</h2>
      <ul>
        {entries.map((entry) => {
          return <Entry key={entry.id} entry={entry} />;
        })}
      </ul>
    </>
  );
};

interface EntryProps {
  entry: DiaryEntryData;
}

const Entry = ({ entry }: EntryProps) => {
  const articleStyle = { listStyle: "none", paddingBottom: "20px" };
  const fieldStyle = { listStyle: "none" };

  return (
    <li style={articleStyle}>
      <article>
        <ul>
          <li style={{ ...fieldStyle, fontWeight: "bold" }}> {entry.date} </li>
          <li style={fieldStyle}> 👁 {entry.visibility} </li>
          <li style={fieldStyle}> ☁ {entry.weather} </li>
        </ul>
      </article>
    </li>
  );
};

export default DiaryEntries;
