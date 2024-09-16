import express from "express";
import patientsService from "../services/patientsService";
import { parseNewPatientData } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  const data = patientsService.getNonSensitive();
  res.json(data);
});

router.post("/", (req, res) => {
  try {
    const patientData = parseNewPatientData(req.body);

    const savedPatient = patientsService.addPatient(patientData);
    res.json(savedPatient);
  } catch (e) {
    let message = "Error: ";
    if (e instanceof Error) {
      message += e.message;
    }
    res.status(400).json({ error: message });
  }
});

export default router;
