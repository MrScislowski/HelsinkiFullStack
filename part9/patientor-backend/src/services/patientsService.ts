import allPatients from "../data/patients";
import { v1 as uuid } from "uuid";
import { NonSensitivePatient, Patient, ProposedPatient } from "../types";

let patients = allPatients;

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitive = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, entries: _entries, ...rest }) => rest);
};

const getPatient = (id: string): Patient => {
  const thePatient = patients.find((p) => p.id === id);
  if (!thePatient) {
    throw new Error(`Patient with id ${id} not found`);
  }
  return thePatient;
};

const addPatient = (patient: ProposedPatient): Patient => {
  const newPatient = { id: uuid(), ...patient };
  patients = patients.concat(newPatient);
  return newPatient;
};

export default { getAll, getNonSensitive, addPatient, getPatient };
