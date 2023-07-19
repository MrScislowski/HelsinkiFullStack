import express from "express";
import diaryService from "../services/diaryService";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(diaryService.getNonSensitiveEntries());
});

router.post("/", (_req, res) => {
  res.send("posting a new diary entry");
});

export default router;
