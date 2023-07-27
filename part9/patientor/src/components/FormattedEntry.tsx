import {
  Diagnosis,
  Entry,
  EntryType,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
} from "../types";

import OccupationalIcon from "@mui/icons-material/Factory";
import HospitalIcon from "@mui/icons-material/LocalHospital";
import HealthCheckIcon from "@mui/icons-material/Check";
import HeartIcon from "@mui/icons-material/Favorite";
import { assertNever } from "../utils";

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

interface Props {
  entry: Entry;
  allDiagnoses: Diagnosis[];
}

const FormattedEntry = (props: Props) => {
  const diagnosesList = (
    <DiagnosesList
      key={props.entry.id}
      allDiagnoses={props.allDiagnoses}
      codes={props.entry.diagnosisCodes}
    />
  );

  const description = <p>{props.entry.description}</p>;

  const footer = <p>diagnosed by {props.entry.specialist}</p>;

  let visitTypeIcon: JSX.Element;
  let healthStatusIcon: JSX.Element | null = null;
  const entry: Entry = props.entry;
  switch (entry.type) {
    case EntryType.Hospital:
      visitTypeIcon = <HospitalIcon color="warning" />;
      break;
    case EntryType.HealthCheck:
      visitTypeIcon = <HealthCheckIcon color="success" />;

      const statusColors = ["green", "yellow", "red", "maroon"];
      const heartColor =
        statusColors[(entry as HealthCheckEntry).healthCheckRating];
      healthStatusIcon = <HeartIcon style={{ color: heartColor }} />;

      break;
    case EntryType.OccupationalHealthcare:
      visitTypeIcon = (
        <>
          <OccupationalIcon color="info" />{" "}
          {(entry as OccupationalHealthcareEntry).employerName};
        </>
      );
      break;
    default:
      return assertNever(entry.type);
  }

  return (
    <div style={{ borderStyle: "solid" }}>
      {props.entry.date} {visitTypeIcon} {healthStatusIcon}
      {description}
      {diagnosesList}
      {footer}
    </div>
  );
};

export default FormattedEntry;
