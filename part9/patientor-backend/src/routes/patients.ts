import express from "express";
import patientsService from "../services/patientsService";
import * as z from "zod";
import { Gender } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  const data = patientsService.getNonSensitive();
  res.json(data);
});

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

router.post("/", (req, res) => {
  try {
    const patientData = newPatientSchema.parse(req.body);

    const savedPatient = patientsService.addPatient(patientData);
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
