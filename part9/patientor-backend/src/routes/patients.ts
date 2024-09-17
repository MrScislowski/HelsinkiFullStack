import express from "express";
import patientsService from "../services/patientsService";
import * as z from "zod";
import { Gender } from "../types";

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

export default router;
