import {
  PatientSansRegistration,
  Gender,
  EntrySansRegistration,
  Diagnosis,
  BaseEntry,
  EntryType,
  HealthCheckRating,
} from "./types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

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

const baseEntryRequirements = [
  "date",
  "description",
  "specialist",
  "type",
] as const;

const isBaseEntry = (object: unknown): object is Omit<BaseEntry, "id"> => {
  if (!isObject(object)) {
    return false;
  }

  if (!baseEntryRequirements.every((field) => field in object)) {
    return false;
  }

  return true;
};

const isObject = (obj: unknown): obj is object => {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return true;
};

const isStringArray = (obj: unknown): obj is string[] => {
  if (!obj || !Array.isArray(obj)) {
    return false;
  }

  return obj.every((el) => isString(el));
};

const parseDiagnosisCodes = (obj: unknown): Array<Diagnosis["code"]> => {
  if (!obj || !isStringArray(obj)) {
    return [];
  }
  return obj;
};

const isEntryType = (obj: unknown): obj is EntryType => {
  if (!obj || !isString(obj)) {
    return false;
  }

  return Object.values(EntryType)
    .map((el) => el.toString())
    .includes(obj);
};

const parseEntryType = (obj: unknown): EntryType => {
  if (!obj || !isEntryType(obj)) {
    throw new Error(
      `Entry types has to be in ${Object.values(EntryType)
        .map((el) => el.toString())
        .join(", ")}`
    );
  }
  return obj;
};

const isHealthCheckRating = (obj: unknown): obj is HealthCheckRating => {
  if (!obj || typeof obj !== "number") {
    return false;
  }

  Object.values(HealthCheckRating);

  return Object.keys(HealthCheckRating)
    .map((x) => parseInt(x))
    .filter((x) => !isNaN(x))
    .includes(obj);
};

const parseHealthCheckRating = (obj: unknown): HealthCheckRating => {
  if (!obj || !isHealthCheckRating(obj)) {
    throw new Error(
      `Health check rating can have these values: ${Object.keys(
        HealthCheckRating
      )
        .map((x) => parseInt(x))
        .filter((x) => !isNaN(x))
        .join(", ")}`
    );
  }
  return obj;
};

export const toEntry = (object: unknown): EntrySansRegistration => {
  if (!object || typeof object !== "object" || !isBaseEntry(object)) {
    throw new Error(
      `Entry must have fields: ${baseEntryRequirements.join(", ")}`
    );
  }

  const baseEntry: Omit<BaseEntry, "id"> = {
    date: parseDate(object.date),
    description: parseString(object.description),
    specialist: parseString(object.specialist),
    type: parseEntryType(object.type),
    diagnosisCodes: parseDiagnosisCodes(object["diagnosisCodes"]),
  };

  switch (baseEntry.type) {
    case EntryType.HospitalEntry:
      if (
        "discharge" in object &&
        isObject(object.discharge) &&
        "date" in object.discharge &&
        "criteria" in object.discharge
      ) {
        return {
          ...baseEntry,
          discharge: {
            date: parseDate(object.discharge.date),
            criteria: parseString(object.discharge.criteria),
          },
        };
      } else {
        throw new Error(
          `Hospital visit must have discharge field with date & criteria`
        );
      }
    case EntryType.OccupationalHealthCare:
      if (!("employerName" in object)) {
        throw new Error("occupational healthcare requires employerName");
      } else {
        const result = {
          ...baseEntry,
          employerName: parseString(object.employerName),
        };
        if (
          "sickLeave" in object &&
          object.sickLeave &&
          typeof object.sickLeave === "object" &&
          "startDate" in object.sickLeave &&
          "endDate" in object.sickLeave
        ) {
          return {
            ...result,
            sickLeave: {
              startDate: parseString(object.sickLeave.startDate),
              endDate: parseString(object.sickLeave.endDate),
            },
          };
        } else {
          return result;
        }
      }
    case EntryType.HealthCheck:
      if (!("healthCheckRating" in object)) {
        throw new Error(
          "health check entries require a healthCheckRating integer"
        );
      } else {
        return {
          ...baseEntry,
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
        };
      }

    default:
      return assertNever(baseEntry.type);
  }
};
