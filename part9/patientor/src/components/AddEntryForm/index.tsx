import {
  useEffect,
  useState,
} from "react";

import { Diagnosis, Patient } from "../../types";
import AddHealthCheckForm from "./AddHealthCheckForm";
import AddHospitalForm from "./AddHospitalForm";

import { Button } from "@mui/material";
import AddOccupationalHealthcareForm from "./AddOccupationalHealthcareForm";
import diagnoses from "../../services/diagnoses";

interface Props {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

const AddEntryForm = ({ patient, setPatient }: Props) => {
  const [entryType, setEntryType] = useState("Health Check");
  const [diagnosisCodes, setDiagnosisCodes] = useState<Diagnosis[]>([]);

  useEffect(() => {
    diagnoses.getAll().then(result => setDiagnosisCodes(result))
  }, [])

  return (
    <div style={{ borderStyle: "dotted", padding: "10px" }}>
      <div style={{display: "flex", justifyContent: "space-evenly"}}>
      <Button style={{fontWeight: entryType==="Health Check" ? "bold" : "normal"}} onClick={() => setEntryType("Health Check")}>Health Check</Button>
      <Button style={{fontWeight: entryType==="Hospital" ? "bold" : "normal"}} onClick={() => setEntryType("Hospital")}>Hospital</Button>
      <Button style={{fontWeight: entryType==="Occupational Healthcare" ? "bold" : "normal"}} onClick={() => setEntryType("Occupational Healthcare")}>Occupational Healthcare</Button>
      </div>

      {entryType === "Health Check" && <AddHealthCheckForm patient={patient} setPatient={setPatient} diagnosisCodes={diagnosisCodes} />}
      {entryType === "Hospital" && <AddHospitalForm patient={patient} setPatient={setPatient} diagnosisCodes={diagnosisCodes} />}
      {entryType === "Occupational Healthcare" && <AddOccupationalHealthcareForm patient={patient} setPatient={setPatient} diagnosisCodes={diagnosisCodes} />}

    </div>
  );
};

export default AddEntryForm;
