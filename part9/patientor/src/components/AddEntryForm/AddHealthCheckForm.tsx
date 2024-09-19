import { useState } from "react";

import { TextField, Grid, Button, Select, MenuItem } from "@mui/material";
import patientsService from "../../services/patients";
import { Diagnosis, Patient } from "../../types";

interface Props {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  diagnosisCodes: Diagnosis[];
}

const AddHealthCheckForm = ({
  patient,
  setPatient,
  diagnosisCodes: allDiagnosisCodes,
}: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthRating, setHealthRating] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Array<Diagnosis["code"]>
  >([]);
  const [notification, setNotification] = useState("");

  const patientId = patient.id;

  if (!patientId) return <p>patient id not found</p>;

  const clearFormEntries = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setHealthRating("");
    setDiagnosisCodes([]);
  };

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();

    patientsService
      .addEntry(patientId, {
        description,
        date,
        specialist,
        healthCheckRating: Number(healthRating),
        diagnosisCodes: diagnosisCodes,
        type: "HealthCheck",
      })
      .then((newEntry) => {
        clearFormEntries();
        setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
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
    <>
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
          type="date"
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

        <Select
          label="Diagnosis codes"
          fullWidth
          multiple
          value={diagnosisCodes}
          onChange={(e) => {
            setDiagnosisCodes(diagnosisCodes.concat(e.target.value));
          }}
        >
          {allDiagnosisCodes.map((code) => {
            return (
              <MenuItem
                key={code.code}
                value={code.code}
              >{`${code.code} - ${code.name}`}</MenuItem>
            );
          })}
        </Select>

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
    </>
  );
};

export default AddHealthCheckForm;
