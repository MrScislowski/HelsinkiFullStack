import { Patient } from "../types";
import { Male, Female } from "@mui/icons-material";
import FormattedEntry from "./FormattedEntry";

interface Props {
  patient: Patient | null | undefined;
}

const SinglePatient = (props: Props) => {
  if (props.patient === null || props.patient === undefined) {
    return <div>patient not found</div>;
  }

  return (
    <div>
      <h3>
        {props.patient.name}{" "}
        {props.patient.gender === "male" ? <Male /> : <Female />}
      </h3>

      <p>occupation: {props.patient.occupation}</p>
      <p>ssn: {props.patient.ssn}</p>

      <h4>Entries</h4>
      {props.patient.entries.map((entry) => {
        return <FormattedEntry key={entry.id} entry={entry} />;
      })}
    </div>
  );
};

export default SinglePatient;
