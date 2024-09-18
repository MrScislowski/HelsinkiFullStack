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
import patientsService from "../../services/patients";
import { Patient } from "../../types";

interface Props {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const AddEntryForm = ({ patient, setPatient }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthRating, setHealthRating] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [notification, setNotification] = useState("");

  const patientId = patient.id;

  if (!patientId) return <p>patient id not found</p>;

  const clearFormEntries = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setHealthRating("");
    setDiagnosisCodes("");
  };

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();

    patientsService
      .addEntry(patientId, {
        description,
        date,
        specialist,
        healthCheckRating: Number(healthRating),
        diagnosisCodes: diagnosisCodes.split(", "),
        type: "HealthCheck",
      })
      .then((newEntry) => {
        clearFormEntries();
        setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
        console.log("Got this data...");
        console.log(newEntry);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setNotification(err.message);
        } else {
          setNotification("unknown error. Check console.");
          console.log(err);
        }
        setTimeout(() => setNotification(""), 5000);
      });
  };

  const Notification = () => {
    if (notification === "") return null;

    return <p style={{ color: "red" }}>{notification}</p>;
  };

  return (
    <div style={{ borderStyle: "dotted", padding: "10px" }}>
      <h3>New HealthCheck Entry</h3>
      <Notification />
      <form onSubmit={addEntry}>
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
