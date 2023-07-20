import {
  Patient,
  PatientNonSensitiveInfo,
  PatientSansRegistration,
} from "../types";
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

const addPatient = (info: PatientSansRegistration): Patient => {
  const newPatient = {
    id: uuid.v1(),
    ...info,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientsNonSensitive,
  addPatient,
};
