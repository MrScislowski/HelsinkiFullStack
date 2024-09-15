import express from "express";
import patientsService from "../services/patientsService";

const router = express.Router();

router.get("/", (_req, res) => {
  const data = patientsService.getNonSensitive();
  res.json(data);
});

export default router;
