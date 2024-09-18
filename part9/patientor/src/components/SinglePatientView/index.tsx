import {
  Patient,
  Entry,
  Diagnosis,
  HealthCheck,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../../types";
import { useMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import patients from "../../services/patients";
import diagnosesService from "../../services/diagnoses";
import {
  Factory,
  Favorite,
  Female,
  HealthAndSafety,
  LocalHospital,
  Male,
} from "@mui/icons-material";
import AddEntryForm from "../AddEntryForm";

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

  let populatedPatient = undefined;

  if (diagnoses.length !== 0) {
    // populate the patient diagnosis codes
    populatedPatient = {
      ...patient,
      entries: patient.entries.map((entry) => {
        return {
          ...entry,
          diagnosisCodes: entry.diagnosisCodes?.map((dc) => {
            return `${dc} ${diagnoses.find((d) => d.code === dc)?.name}`;
          }),
        };
      }),
    };
  }

  return (
    <>
      <h3>
        {patient.name} {patient.gender === "male" ? <Male /> : <Female />}
      </h3>
      <ul style={{ listStyle: "none" }}>
        <li>ssn: {patient.ssn}</li>
        <li>occupation: {patient.occupation}</li>
      </ul>
      <AddEntryForm patient={patient} setPatient={setPatient} /> <br />
      <h4>entries</h4>
      {populatedPatient?.entries.map((e) => (
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
    <div
      style={{
        borderStyle: "solid",
        margin: "5px",
        padding: "3px",
        borderRadius: "7px",
      }}
    >
      <EntryDetails entry={entry} />
    </div>
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckView entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareView entry={entry} />;
    case "Hospital":
      return <HospitalView entry={entry} />;
    default:
      const _exhaustive: never = entry;
      return _exhaustive;
  }
};

const HealthCheckView = ({ entry }: { entry: HealthCheck }) => {
  return (
    <article>
      <div>
        {entry.date} <HealthAndSafety />
      </div>
      <div>
        <em>{entry.description}</em>
      </div>
      <Favorite
        style={{
          color:
            entry.healthCheckRating == 0
              ? "green"
              : entry.healthCheckRating == 1
              ? "yellow"
              : "red",
        }}
      />
      <div>Diagnosed by {entry.specialist}</div>
    </article>
  );
};

const OccupationalHealthcareView = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <article>
      <div>
        {entry.date} <Factory /> <em>{entry.employerName}</em>
      </div>
      <div>
        <em>{entry.description}</em>
      </div>

      {entry.sickLeave && (
        <div>
          sick leave {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </div>
      )}

      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}

      <div>Diagnosed by {entry.specialist}</div>
    </article>
  );
};

const HospitalView = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <article>
      <p>
        {entry.date} <LocalHospital />
      </p>

      <div>
        <em>{entry.description}</em>
      </div>

      <div>
        Discharge: {entry.discharge.date} - {entry.discharge.criteria}
      </div>

      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}

      <div>Diagnosed by {entry.specialist}</div>
    </article>
  );
};

export default SinglePatientView;
