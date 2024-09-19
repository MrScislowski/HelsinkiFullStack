import { useEffect, useState } from "react";

import {
  blankHealthCheckEntry,
  blankHospitalEntry,
  blankOccupationalHealtcareEntry,
  Diagnosis,
  EntrySansId,
  Patient,
} from "../../types";
import AddHealthCheckForm from "./AddHealthCheckForm";
import AddHospitalForm from "./AddHospitalForm";

import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import AddOccupationalHealthcareForm from "./AddOccupationalHealthcareForm";
import diagnoses from "../../services/diagnoses";
import patientsService from "../../services/patients";

interface Props {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const AddEntryForm = ({ patient, setPatient }: Props) => {
  const [entryType, setEntryType] = useState("Health Check");
  const [allDiagnosisCodes, setAllDiagnosisCodes] = useState<Diagnosis[]>([]);

  const [formState, setFormState] = useState<EntrySansId>(
    entryType === "Health Check"
      ? blankHealthCheckEntry
      : entryType === "Hospital"
      ? blankHospitalEntry
      : blankOccupationalHealtcareEntry
  );

  const [notification, setNotification] = useState("");

  useEffect(() => {
    diagnoses.getAll().then((result) => setAllDiagnosisCodes(result));
  }, []);

  const patientId = patient.id;

  const clearFormEntries = () => {
    setFormState(
      entryType === "Health Check"
        ? blankHealthCheckEntry
        : entryType === "Hospital"
        ? blankHospitalEntry
        : blankOccupationalHealtcareEntry
    );
  };

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();

    patientsService
      .addEntry(patientId, formState)
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

  if (!patientId) return <p>patient id not found</p>;

  return (
    <div style={{ borderStyle: "dotted", padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          style={{
            fontWeight: entryType === "Health Check" ? "bold" : "normal",
          }}
          onClick={() => {
            setEntryType("Health Check");
            setFormState(blankHealthCheckEntry);
          }}
        >
          Health Check
        </Button>
        <Button
          style={{ fontWeight: entryType === "Hospital" ? "bold" : "normal" }}
          onClick={() => {
            setEntryType("Hospital");
            setFormState(blankHospitalEntry);
          }}
        >
          Hospital
        </Button>
        <Button
          style={{
            fontWeight:
              entryType === "Occupational Healthcare" ? "bold" : "normal",
          }}
          onClick={() => {
            setEntryType("Occupational Healthcare");
            setFormState(blankOccupationalHealtcareEntry);
          }}
        >
          Occupational Healthcare
        </Button>
      </div>

      <Notification />

      <form onSubmit={addEntry}>
        {/* BASE FORM ELEMENTS */}
        <TextField
          label="Date"
          fullWidth
          value={formState.date}
          type="date"
          onChange={({ target }) =>
            setFormState({ ...formState, date: target.value })
          }
        />
        <TextField
          label="Description"
          fullWidth
          value={formState.description}
          onChange={({ target }) =>
            setFormState({ ...formState, description: target.value })
          }
        />
        <TextField
          label="Specialist"
          fullWidth
          value={formState.specialist}
          onChange={({ target }) =>
            setFormState({ ...formState, specialist: target.value })
          }
        />

        <Select
          label="Diagnosis codes"
          fullWidth
          multiple
          value={formState.diagnosisCodes}
          onChange={(e) => {
            setFormState({
              ...formState,
              diagnosisCodes: [...e.target.value],
            });
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

        {formState.type === "HealthCheck" && (
          <AddHealthCheckForm
            formState={formState}
            setFormState={setFormState}
          />
        )}
        {formState.type === "Hospital" && (
          <AddHospitalForm formState={formState} setFormState={setFormState} />
        )}
        {formState.type === "OccupationalHealthcare" && (
          <AddOccupationalHealthcareForm
            formState={formState}
            setFormState={setFormState}
          />
        )}

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
