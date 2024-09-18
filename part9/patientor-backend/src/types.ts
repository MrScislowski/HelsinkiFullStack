import * as z from "zod";

export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

const diagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

export type Diagnosis = z.infer<typeof diagnosisSchema>;

const baseEntrySchema = z.object({
  id: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  diagnosisCodes: z.array(diagnosisSchema.shape.code).optional(),
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
  type: z.literal("HealthCheck"),
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
