import allPatients from "../data/patients";
import { v1 as uuid } from "uuid";
import {
  NonSensitivePatient,
  Patient,
  ProposedPatient,
  Entry,
  UnsavedEntry,
} from "../types";

let patients = allPatients;

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitive = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, entries: _entries, ...rest }) => rest);
};

const getPatient = (id: string): Patient | null => {
  const thePatient = patients.find((p) => p.id === id);
  if (!thePatient) {
    return null;
  }
  return thePatient;
};

const addPatient = (patient: ProposedPatient): Patient => {
  const newPatient = { id: uuid(), ...patient };
  patients = patients.concat(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: UnsavedEntry): Entry => {
  const newEntry: Entry = { ...entry, id: uuid() };

  const thePatient = patients.find((patient) => patient.id === patientId);

  if (!thePatient) {
    throw new Error(`Patient with id '${patientId}' not found`);
  }

  thePatient.entries.push(newEntry);
  return newEntry;
};

export default {
  getAll,
  getNonSensitive,
  addPatient,
  getPatient,
  addEntry,
};
