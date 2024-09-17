import { Patient } from "../../types";
import { useMatch } from "react-router-dom";
import { useEffect } from "react";

interface SinglePatientViewProps {
  patient: Patient | undefined;
}

const SinglePatientView = ({ patient }: SinglePatientViewProps) => {
  const urlMatch = useMatch("/:id");

  useEffect(() => {
    // get the patient from the service here
  }, []);

  if (!patient) return <p>patient not found</p>;

  return (
    <>
      <ul>
        <li>{patient.name}</li>
        <li>{patient.gender}</li>
        <li>{patient.occupation}</li>
      </ul>
    </>
  );
};

export default SinglePatientView;
