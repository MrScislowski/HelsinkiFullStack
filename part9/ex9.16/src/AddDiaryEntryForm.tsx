import { useState } from "react";
import { FlightDetailsSafe } from "./types";
import axios, { AxiosError } from "axios";

interface RadioGroupProps {
  name: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
}

const RadioGroup = (props: RadioGroupProps) => {
  return (
    <fieldset>
      <legend> {props.name} </legend>
      {props.options.map((opt) => {
        return (
          <label key={opt}>
            {opt}
            <input
              type="radio"
              value={opt}
              checked={props.value === opt}
              onChange={(e) => props.setValue(e.target.value)}
            />
          </label>
        );
      })}
    </fieldset>
  );
};

interface AddDiaryEntryFormProps {
  addEntry: (e: FlightDetailsSafe) => void;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}

const AddDiaryEntryForm = (props: AddDiaryEntryFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    axios
      .post<FlightDetailsSafe>("http://localhost:3000/api/diaries", {
        date,
        visibility,
        weather,
        comment,
      })
      .then((res) => {
        props.addEntry(res.data);
        setDate(new Date().toISOString().split("T")[0]);
        setVisibility("");
        setWeather("");
        setComment("");
      })
      .catch((err: Error | AxiosError) => {
        let errorMessage = "";
        if (axios.isAxiosError(err)) {
          errorMessage += err.response ? err.response.data : "";
        } else {
          errorMessage += err.message;
        }
        props.setNotification(errorMessage);
      });
  };

  return (
    <>
      <form>
        <label>
          date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <RadioGroup
          name="visibility"
          value={visibility}
          setValue={setVisibility}
          options={["great", "good", "ok", "poor"]}
        />
        <RadioGroup
          name="weather"
          value={weather}
          setValue={setWeather}
          options={["sunny", "rainy", "cloudy", "stormy", "windy"]}
        />
        <label>
          comment
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          submit
        </button>
      </form>
    </>
  );
};

export default AddDiaryEntryForm;
