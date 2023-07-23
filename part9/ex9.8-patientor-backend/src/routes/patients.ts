import express from "express";
import patientService from "../services/patientService";
import { toPatientSansRegistration } from "../utils";
import { PatientSansRegistration } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json(patientService.getPatientsNonSensitive());
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const foundPatient = patientService.getPatientById(id);
  if (!foundPatient) {
    return res.status(404);
  }
  return res.json(foundPatient);
});

router.post("/", (req, res) => {
  // req.body is:
  // {"name":"Name input","occupation":"teacher","ssn":"social security input","dateOfBirth":"1970-01-01","gender":"male"}

  try {
    const newPatientInfo: PatientSansRegistration = toPatientSansRegistration(
      req.body
    );
    const newPatientObject = patientService.addPatient(newPatientInfo);
    res.json(newPatientObject);
  } catch (error: unknown) {
    let errorMessage = "error adding post";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
