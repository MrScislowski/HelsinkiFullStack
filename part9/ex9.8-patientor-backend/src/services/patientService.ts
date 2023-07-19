import { Patient, PatientNonSensitiveInfo } from "../types";
import patients from "../../data/patients";
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

const addPatient = (patientInfo: unknown) => {
  // const id: string = uuid();
  const id: string = uuid.v1();
  const newPatient: Patient = { id, ...(patientInfo as object) } as Patient;
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientsNonSensitive,
  addPatient,
};
