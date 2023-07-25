// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface BaseEntry {
  id: string;
  date: string;
  description: string;
  specialist: string;
  type: EntryType;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export interface HospitalEntry extends BaseEntry {
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HealthCheckEntry extends BaseEntry {
  healthCheckRating: HealthCheckRating;
}

export enum EntryType {
  HospitalEntry = "Hospital",
  OccupationalHealthCare = "OccupationalHealthcare",
  HealthCheck = "HealthCheck",
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type EntrySansRegistration = UnionOmit<Entry, "id">;
export type PatientSansRegistration = Omit<Patient, "id">;

export type PatientNonSensitiveInfo = Omit<Patient, "ssn" | "entries">;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
