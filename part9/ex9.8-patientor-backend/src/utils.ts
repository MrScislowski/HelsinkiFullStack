import { PatientSansRegistration, Gender } from "./types";

const parseString = (text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error("string expected");
  }
  return text;
};

const isString = (text: unknown): text is string => {
  return text instanceof String || typeof text === "string";
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const isGender = (text: unknown): text is Gender => {
  if (!text || !isString(text)) {
    return false;
  }

  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(text);
};

const parseGender = (text: unknown): Gender => {
  if (!text || !isGender(text)) {
    throw new Error(
      `possible genders are: ${Object.values(Gender)}; got ${text}`
    );
  }

  return text;
};

export const toPatientSansRegistration = (
  object: unknown
): PatientSansRegistration => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    return {
      name: parseString(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
      entries: [],
    };
  } else {
    throw new Error("missing fields");
  }
};
