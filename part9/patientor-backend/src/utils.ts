import { ProposedPatient } from "./types";

const isString = (data: unknown): data is string => {
  return typeof data === "string" || data instanceof String;
};

const parseString = (data: unknown): string => {
  if (!data || !isString(data)) {
    throw new Error(`${data} is not a string, as required`);
  }
  return data;
};

export const parseNewPatientData = (data: unknown): ProposedPatient => {
  // name, dateOfBirth, ssn, gender, occupation
  if (!(data && typeof data === "object")) {
    throw new Error("patient data required");
  }

  if (
    !(
      "name" in data &&
      "dateOfBirth" in data &&
      "ssn" in data &&
      "gender" in data &&
      "occupation" in data
    )
  ) {
    throw new Error("missing required patient data");
  }

  return {
    name: parseString(data.name),
    dateOfBirth: parseString(data.dateOfBirth),
    ssn: parseString(data.ssn),
    gender: parseString(data.gender),
    occupation: parseString(data.occupation),
  };
};
