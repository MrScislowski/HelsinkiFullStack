import * as z from "zod";

export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

const diagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

const baseEntrySchema = z.object({
  id: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  // TODO: This was in the notes: diagnosisCodes?: Diagnosis['code'][];
  // I don't really understand that. And how do I implement it in zod?
  throw new Error("TODO HERE!!")
});

export const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

export type OccupationalHealthcareEntry = z.infer<
  typeof occupationalHealthcareEntrySchema
>;

export const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string(),
  }),
});

export type HospitalEntry = z.infer<typeof hospitalEntrySchema>;

export const healthCheckSchema = baseEntrySchema.extend({
  type: z.literal("healthCheck"),
  healthCheckRating: z.number().gte(0).lte(2),
});

export type HealthCheck = z.infer<typeof healthCheckSchema>;

export const entrySchema = z.discriminatedUnion("type", [
  occupationalHealthcareEntrySchema,
  hospitalEntrySchema,
  healthCheckSchema,
]);

export type Entry = z.infer<typeof entrySchema>;

const omits = {
  id: true,
} as const;

export const unsavedEntrySchema = z.discriminatedUnion("type", [
  occupationalHealthcareEntrySchema.omit(omits),
  hospitalEntrySchema.omit(omits),
  healthCheckSchema.omit(omits),
]);

export type UnsavedEntry = z.infer<typeof unsavedEntrySchema>;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

export type ProposedPatient = Omit<Patient, "id">;
