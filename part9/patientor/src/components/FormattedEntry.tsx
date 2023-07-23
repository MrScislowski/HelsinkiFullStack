import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";

// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
import OccupationalIcon from "@mui/icons-material/Factory";
import HospitalIcon from "@mui/icons-material/LocalHospital";
import HealthCheckIcon from "@mui/icons-material/Check";
import HeartIcon from "@mui/icons-material/Favorite";
import { SvgIconTypeMap } from "@mui/material";
import { stat } from "fs";

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
  switch (props.entry.type) {
    case "Hospital":
      visitTypeIcon = <HospitalIcon color="warning" />;
      break;
    case "HealthCheck":
      visitTypeIcon = <HealthCheckIcon color="success" />;

      const statusColors = ["green", "yellow", "red", "maroon"];
      const heartColor = statusColors[props.entry.healthCheckRating];
      healthStatusIcon = <HeartIcon style={{ color: heartColor }} />;

      break;
    case "OccupationalHealthcare":
      visitTypeIcon = (
        <>
          <OccupationalIcon color="info" /> {props.entry.employerName};
        </>
      );
      break;
    default:
      return assertNever(props.entry);
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
