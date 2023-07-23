import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface Props {
  entry: Entry;
  allDiagnoses: Diagnosis[];
}

interface DiagnosesListProps {
  codes: string[] | undefined;
  allDiagnoses: Diagnosis[];
}

const DiagnosesList = (props: DiagnosesListProps) => {
  if (!props.codes || props.codes.length === 0) {
    return null;
  }

  return (
    <ul>
      {props.codes.map((code) => {
        return (
          <li key={code}>
            {code}: {props.allDiagnoses.find((el) => el.code === code)?.name}
          </li>
        );
      })}
    </ul>
  );
};

const FormattedEntry = (props: Props) => {
  switch (props.entry.type) {
    case "Hospital":
      return (
        <FormattedHospitalEntry
          allDiagnoses={props.allDiagnoses}
          entry={props.entry}
        ></FormattedHospitalEntry>
      );
    case "HealthCheck":
      return (
        <FormattedHealthCheckEntry
          allDiagnoses={props.allDiagnoses}
          entry={props.entry}
        ></FormattedHealthCheckEntry>
      );
    case "OccupationalHealthcare":
      return (
        <FormattedOccupationalHealthcareEntry
          allDiagnoses={props.allDiagnoses}
          entry={props.entry}
        ></FormattedOccupationalHealthcareEntry>
      );
    default:
      return assertNever(props.entry);
  }
};

interface HospitalEntryProps {
  entry: HospitalEntry;
  allDiagnoses: Diagnosis[];
}
const FormattedHospitalEntry = (props: HospitalEntryProps) => {
  const entry = props.entry;

  return (
    <>
      {entry.date}: <em>{entry.description}</em>
      <DiagnosesList
        key={entry.id}
        allDiagnoses={props.allDiagnoses}
        codes={entry.diagnosisCodes}
      />
    </>
  );
};

interface HealthCheckEntryProps {
  entry: HealthCheckEntry;
  allDiagnoses: Diagnosis[];
}
const FormattedHealthCheckEntry = (props: HealthCheckEntryProps) => {
  const entry = props.entry;

  return (
    <>
      {entry.date}: <em>{entry.description}</em>
      <DiagnosesList
        key={entry.id}
        allDiagnoses={props.allDiagnoses}
        codes={entry.diagnosisCodes}
      />
    </>
  );
};

interface OccupationalHealthcareEntryProps {
  entry: OccupationalHealthcareEntry;
  allDiagnoses: Diagnosis[];
}

const FormattedOccupationalHealthcareEntry = (
  props: OccupationalHealthcareEntryProps
) => {
  const entry = props.entry;

  return (
    <div>
      {entry.date}: <em>{entry.description}</em>
      <DiagnosesList
        key={entry.id}
        allDiagnoses={props.allDiagnoses}
        codes={entry.diagnosisCodes}
      />
    </div>
  );
};

export default FormattedEntry;
