import { useState } from "react";
import { FlightDetailsSafe } from "./types";
import axios, { AxiosError } from "axios";

interface AddDiaryEntryFormProps {
  addEntry: (e: FlightDetailsSafe) => void;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}

const useTextField = () => {
  const [value, setValue] = useState("");

  return {
    type: "text",
    value: value,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
  };
};

const AddDiaryEntryForm = (props: AddDiaryEntryFormProps) => {
  const date = useTextField();
  const visibility = useTextField();
  const weather = useTextField();
  const comment = useTextField();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    axios
      .post<FlightDetailsSafe>("http://localhost:3000/api/diaries", {
        date: date.value,
        visibility: visibility.value,
        weather: weather.value,
        comment: comment.value,
      })
      .then((res) => {
        props.addEntry(res.data);
        [date, visibility, weather, comment].forEach((field) => {
          field.onChange({
            target: { value: "" },
          } as React.ChangeEvent<HTMLInputElement>);
        });
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
          date: <input {...date} />
        </label>
        <br />
        <label>
          visibility: <input {...visibility} />
        </label>
        <br />
        <label>
          weather: <input {...weather} />
        </label>
        <br />
        <label>
          comment: <input {...comment} />
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
