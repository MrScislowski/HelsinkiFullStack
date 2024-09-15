import allPatients from "../data/patients";
import { Patient } from "../types";

const getAll = (): Patient[] => {
  return allPatients;
};

const getNonSensitive = (): Omit<Patient, "ssn">[] => {
  return allPatients.map(({ ssn: _ssn, ...rest }) => rest);
};

export default { getAll, getNonSensitive };
