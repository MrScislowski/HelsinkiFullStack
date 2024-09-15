import express from "express";
import patientsService from "../services/patientsService";

const router = express.Router();

router.get("/", (_req, res) => {
  const data = patientsService.getNonSensitive();
  res.json(data);
});

router.post("/", (req, res) => {
  console.log("about to add a patient");

  const patientData = parseNewPatientData(req.body);

  patientsService.addPatient();
  res.send();
});

export default router;
