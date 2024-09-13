import express from "express";
import { calculateBmi, parseBmiParams } from "./bmiCalculator";

const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. `);
});
