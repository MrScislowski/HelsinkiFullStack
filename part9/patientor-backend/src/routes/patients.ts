import express, { Response } from "express";
import patientsService from "../services/patientsService";
import * as z from "zod";
import { Gender, unsavedEntrySchema, Entry } from "../types";

const router = express.Router();

// Get all patients
router.get("/", (_req, res) => {
  const data = patientsService.getNonSensitive();
  res.json(data);
});

// Get one patient detailed info
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const patientData = patientsService.getPatient(id);
  if (!patientData) res.status(404).send();
  res.json(patientData);
});

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

// add a patient
router.post("/", (req, res) => {
  try {
    const patientData = newPatientSchema.parse(req.body);

    const savedPatient = patientsService.addPatient({
      ...patientData,
      entries: [],
    });
    res.json(savedPatient);
  } catch (e) {
    let message = "Error: ";
    if (e instanceof z.ZodError) {
      res.status(400).send({ error: e.issues });
    }
    if (e instanceof Error) {
      message += e.message;
    }
    res.status(400).json({ error: message });
  }
});

// add an entry
router.post(
  "/:id/entries",
  (req, res: Response<Entry | { error: object | string }>) => {
    try {
      const patientId = req.params.id;
      const patient = patientsService.getPatient(patientId);
      if (!patient) {
        return res.status(404).send();
      }

      const unsavedEntry = unsavedEntrySchema.parse(req.body);
      const savedEntry = patientsService.addEntry(patientId, unsavedEntry);

      res.json(savedEntry);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.issues });
      } else if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "unknown error type" });
      }
    }
    // to make 'Not all code paths return a value' error go away
    return;
  }
);

export default router;
