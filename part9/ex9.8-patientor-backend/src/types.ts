export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export type PatientSansRegistration = Omit<Patient, "id">;

export type PatientNonSensitiveInfo = Omit<Patient, "ssn">;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
