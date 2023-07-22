import { FlightDetailsSafe } from "./types";

interface DiaryEntriesListProps {
  entries: FlightDetailsSafe[];
}

const DiaryEntriesList = (props: DiaryEntriesListProps) => {
  return (
    <ul>
      {props.entries.map((entry) => {
        return (
          <li style={{ listStyleType: "none" }} key={entry.id}>
            {entry.date}: {entry.weather} weather {entry.visibility} visibility
          </li>
        );
      })}
    </ul>
  );
};

export default DiaryEntriesList;
