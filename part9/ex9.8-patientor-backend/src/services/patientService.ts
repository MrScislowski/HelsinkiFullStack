import { Patient, PatientNonSensitiveInfo } from "../types";
import patients from "../../data/patients";

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsNonSensitive = (): PatientNonSensitiveInfo[] => {
  return patients.map((patient) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssn, ...nonSensitiveInfo } = patient;
    return nonSensitiveInfo;
  });
};

export default {
  getPatients,
  getPatientsNonSensitive,
};
