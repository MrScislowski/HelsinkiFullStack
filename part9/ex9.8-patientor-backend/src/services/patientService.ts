import {
  EntrySansRegistration,
  Patient,
  PatientNonSensitiveInfo,
  PatientSansRegistration,
  Entry,
} from "../types";
import patients from "../../data/patients-full";
// import { v1 as uuid } from "uuid";
import uuid = require("uuid");

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

const getPatientById = (id: string): Patient | undefined => {
  const patientInfo = patients.find((p) => p.id === id);
  if (!patientInfo) {
    return patientInfo;
  }

  return patientInfo;
};

const addPatient = (info: PatientSansRegistration): Patient => {
  const newPatient = {
    id: uuid.v1(),
    ...info,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntryToPatient = (
  patient: Patient,
  entry: EntrySansRegistration
): Entry => {
  const newEntry: Entry = {
    id: uuid.v1(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatientsNonSensitive,
  getPatientById,
  addPatient,
  addEntryToPatient,
};
