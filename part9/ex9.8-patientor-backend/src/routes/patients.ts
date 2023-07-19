import express from "express";
import patientService from "../services/patientService";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json(patientService.getPatientsNonSensitive());
});

export default router;
