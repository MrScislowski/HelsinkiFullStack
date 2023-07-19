import express from "express";
import patientService from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json(patientService.getPatientsNonSensitive());
});

router.post("/", (req, res) => {
  // req.body is:
  // {"name":"Name input","occupation":"teacher","ssn":"social security input","dateOfBirth":"1970-01-01","gender":"male"}

  const newPatient = patientService.addPatient(req.body);

  res.json(newPatient);
});

export default router;
