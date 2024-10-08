import { useState } from "react";
import { DiaryEntryData, Visibility, Weather } from "../types";
import diaryService from "../services/diaryService";
import { AxiosError } from "axios";

interface AddEntryFormProps {
  entries: DiaryEntryData[];
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntryData[]>>;
}

const AddEntryForm = ({ entries, setEntries }: AddEntryFormProps) => {
  const [notification, setNotification] = useState("");
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    diaryService
      .add({ date, visibility, weather, comment })
      .then((newEntry) => {
        setEntries(entries.concat(newEntry));
        setDate("");
        setVisibility("");
        setWeather("");
        setComment("");
      })
      .catch((e: unknown) => {
        let message: string;
        if (e instanceof AxiosError) {
          message = e.response?.data || "Axios error with no data supplied";
        } else {
          message = "Non-axios error";
        }
        setNotification(message);
        setTimeout(() => setNotification(""), 5000);
      });
  };

  const Notification = () => {
    if (notification === "") {
      return null;
    }

    return <p style={{ color: "red" }}>{notification}</p>;
  };

  return (
    <>
      <h2>Add New Entry</h2>
      <Notification />
      <form onSubmit={handleSubmit}>
        <label>
          date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <br />
        </label>

        <label>
          visibility:
          {Object.values(Visibility)
            .map((v) => v.toString())
            .map((v) => {
              return (
                <label key={v}>
                  <input
                    key={v}
                    name="visibility"
                    type="radio"
                    checked={visibility === v}
                    value={v}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  {v}
                </label>
              );
            })}
          <br />
        </label>

        <label>
          weather:
          {Object.values(Weather)
            .map((v) => v.toString())
            .map((v) => {
              return (
                <label key={v}>
                  <input
                    key={v}
                    name="weather"
                    type="radio"
                    checked={weather === v}
                    value={v}
                    onChange={(e) => setWeather(e.target.value)}
                  />
                  {v}
                </label>
              );
            })}
          <br />
        </label>

        <label>
          comment:
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
        </label>

        <button type="submit">Add Entry</button>
      </form>
    </>
  );
};

export default AddEntryForm;
