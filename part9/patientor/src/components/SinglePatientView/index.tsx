import { Patient, Entry } from "../../types";
import { useMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import patients from "../../services/patients";
import { Female, Male } from "@mui/icons-material";

const SinglePatientView = () => {
  const urlMatch = useMatch("/patients/:id");
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  const id: string | undefined = urlMatch?.params.id;

  useEffect(() => {
    // get the patient from the service here
    id && patients.getById(id).then((res) => setPatient(res));
  }, [id]);

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
        <EntryView key={e.id} entry={e} />
      ))}
    </>
  );
};

interface EntryViewProps {
  entry: Entry;
}

const EntryView = ({ entry }: EntryViewProps) => {
  return (
    <div>
      <span>
        {entry.date} <em>{entry.description}</em>
      </span>
      <br />
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SinglePatientView;
