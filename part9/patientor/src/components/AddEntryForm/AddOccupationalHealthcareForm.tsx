import {
  useState,
} from "react";

import {
  TextField,
  Grid,
  Button,
} from "@mui/material";
import patientsService from "../../services/patients";
import { Patient } from "../../types";

interface Props {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const AddOccupationalHealthcareForm = ({patient, setPatient}: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");

  const [employerName, setEmployerName] = useState("");
  const [sickleaveStartDate, setSickleaveStartDate] = useState("");
  const [sickleaveEndDate, setSickleaveEndDate] = useState("");



  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [notification, setNotification] = useState("");

  const patientId = patient.id;

  if (!patientId) return <p>patient id not found</p>;

  const clearFormEntries = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagnosisCodes("");
  };

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();

    patientsService
      .addEntry(patientId, {
        description,
        date,
        specialist,
        employerName,
        sickLeave: {startDate: sickleaveStartDate, endDate: sickleaveEndDate},
        diagnosisCodes: diagnosisCodes.split(", "),
        type: "OccupationalHealthcare",
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
      <h3>New Occupational Healthcare Entry</h3>
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
          label="Employer"
          fullWidth
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
        />
        <TextField
          label="Sick Leave Start Date"
          fullWidth
          value={sickleaveStartDate}
          onChange={({ target }) => setSickleaveStartDate(target.value)}
        />
        <TextField
          label="Sick Leave End Date"
          fullWidth
          value={sickleaveEndDate}
          onChange={({ target }) => setSickleaveEndDate(target.value)}
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
    </>
  );
};

export default AddOccupationalHealthcareForm;