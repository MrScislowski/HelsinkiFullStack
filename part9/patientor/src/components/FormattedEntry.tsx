import {
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
}

const FormattedEntry = (props: Props) => {
  switch (props.entry.type) {
    case "Hospital":
      return (
        <FormattedHospitalEntry entry={props.entry}></FormattedHospitalEntry>
      );
    case "HealthCheck":
      return (
        <FormattedHealthCheckEntry
          entry={props.entry}
        ></FormattedHealthCheckEntry>
      );
    case "OccupationalHealthcare":
      return (
        <FormattedOccupationalHealthcareEntry
          entry={props.entry}
        ></FormattedOccupationalHealthcareEntry>
      );
    default:
      return assertNever(props.entry);
  }
};

interface HospitalEntryProps {
  entry: HospitalEntry;
}
const FormattedHospitalEntry = (props: HospitalEntryProps) => {
  const entry = props.entry;

  return (
    <>
      {entry.date}: <em>{entry.description}</em>
      {!entry.diagnosisCodes ? null : (
        <ul>
          {entry.diagnosisCodes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </>
  );
};

interface HealthCheckEntryProps {
  entry: HealthCheckEntry;
}
const FormattedHealthCheckEntry = (props: HealthCheckEntryProps) => {
  const entry = props.entry;

  return (
    <>
      {entry.date}: <em>{entry.description}</em>
      {!entry.diagnosisCodes ? null : (
        <ul>
          {entry.diagnosisCodes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </>
  );
};

interface OccupationalHealthcareEntryProps {
  entry: OccupationalHealthcareEntry;
}

const FormattedOccupationalHealthcareEntry = (
  props: OccupationalHealthcareEntryProps
) => {
  const entry = props.entry;

  return (
    <div>
      {entry.date}: <em>{entry.description}</em>
      {!entry.diagnosisCodes ? null : (
        <ul>
          {entry.diagnosisCodes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormattedEntry;
