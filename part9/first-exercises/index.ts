import express from "express";
import { calculateBmi, parseBmiParams } from "./bmiCalculator";
import {
  calculateExercises,
  parseRequestBodyExerciseData,
} from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  try {
    const bmiParams = parseBmiParams(req.query);
    const bmi = calculateBmi(bmiParams);
    res.json({ ...bmiParams, bmi });
  } catch (e: unknown) {
    let message = "Error occurred. ";
    if (e instanceof Error) {
      message += "Details: ";
      message += e.message;
    }
    res.status(400).json({ error: message });
  }
});

app.post("/exercises", (req, res) => {
  try {
    const exerciseData = parseRequestBodyExerciseData(req.body);
    const exerciseLog = calculateExercises(exerciseData);
    res.json(exerciseLog);
  } catch (e: unknown) {
    let errorMessage = "";
    if (e instanceof Error) {
      errorMessage += e.message;
    }
    console.log(e);
    res.status(400).json({ error: errorMessage });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. `);
});
