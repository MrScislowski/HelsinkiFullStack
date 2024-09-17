import { Patient, Entry, Diagnosis } from "../../types";
import { useMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import patients from "../../services/patients";
import diagnosesService from "../../services/diagnoses";
import { Female, Male } from "@mui/icons-material";

const SinglePatientView = () => {
  const urlMatch = useMatch("/patients/:id");
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const id: string | undefined = urlMatch?.params.id;

  useEffect(() => {
    // get the patient from the service here
    id && patients.getById(id).then((res) => setPatient(res));
  }, [id]);

  useEffect(() => {
    diagnosesService.getAll().then((res) => setDiagnoses(res));
  }, []);

  if (!patient) return <p>patient not found</p>;

  return (
    <>
      <h3>
        {patient.name} {patient.gender === "male" ? <Male /> : <Female />}
      </h3>
      <ul style={{ listStyle: "none" }}>
        <li>ssn: {patient.ssn}</li>
        <li>occupation: {patient.occupation}</li>
      </ul>
      <h4>entries</h4>
      {patient.entries.map((e) => (
        <EntryView key={e.id} entry={e} diagnoses={diagnoses} />
      ))}
    </>
  );
};

interface EntryViewProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryView = ({ entry, diagnoses }: EntryViewProps) => {
  return (
    <div>
      <span>
        {entry.date} <em>{entry.description}</em>
      </span>
      <br />
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((dc) => (
            <li key={dc}>
              {dc} {diagnoses.find((d) => d.code === dc)?.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SinglePatientView;
