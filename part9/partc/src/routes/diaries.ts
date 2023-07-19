import express from "express";
import diaryService from "../services/diaryService";
import { toNewDiaryEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(diaryService.getNonSensitiveEntries());
});

router.post("/", (req, res) => {
  try {
    const newEntry = toNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.get("/:id", (req, res) => {
  const diaryEntry = diaryService.findById(Number(req.params.id));
  if (diaryEntry) {
    res.send(diaryEntry);
  } else {
    res.sendStatus(404);
  }
});

export default router;
