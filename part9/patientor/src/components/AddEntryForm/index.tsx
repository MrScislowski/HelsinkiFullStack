import {
  useState,
  // SyntheticEvent,
} from "react";

import {
  TextField,
  // InputLabel,
  // MenuItem,
  // Select,
  Grid,
  Button,
  // SelectChangeEvent,
} from "@mui/material";

const AddEntryForm = () => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthRating, setHealthRating] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");

  const clearFormEntries = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setHealthRating("");
    setDiagnosisCodes("");
  };

  const addEntry = () => {};

  return (
    <div style={{ borderStyle: "dotted", padding: "10px" }}>
      <h3>New HealthCheck Entry</h3>
      <form onSubmit={() => alert("to be implemented")}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="Healthcheck rating"
          fullWidth
          value={healthRating}
          onChange={({ target }) => setHealthRating(target.value)}
        />
        <TextField
          label="Diagnosis codes"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value)}
        />

        <Grid style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            color="secondary"
            variant="contained"
            type="button"
            onClick={clearFormEntries}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
