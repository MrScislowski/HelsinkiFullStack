export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn: string;
  dateOfBirth: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;

interface BaseEntry {
  id: string;
  date: string;
  specialist: string;
  description: string;
  diagnosisCodes?: string[];
}

const blankBaseEntry: Omit<BaseEntry, "id"> = {
  date: "",
  description: "",
  specialist: "",
  diagnosisCodes: [],
};

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export const blankOccupationalHealtcareEntry: Omit<
  OccupationalHealthcareEntry,
  "id"
> = {
  ...blankBaseEntry,
  type: "OccupationalHealthcare",
  employerName: "",
  sickLeave: { startDate: "", endDate: "" },
};

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export const blankHospitalEntry: Omit<HospitalEntry, "id"> = {
  ...blankBaseEntry,
  type: "Hospital",
  discharge: {
    date: "",
    criteria: "",
  },
};

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: number;
}

export const blankHealthCheckEntry: Omit<HealthCheckEntry, "id"> = {
  ...blankBaseEntry,
  type: "HealthCheck",
  healthCheckRating: -1,
};

export type Entry =
  | OccupationalHealthcareEntry
  | HospitalEntry
  | HealthCheckEntry;

export type EntrySansId =
  | Omit<OccupationalHealthcareEntry, "id">
  | Omit<HospitalEntry, "id">
  | Omit<HealthCheckEntry, "id">;
