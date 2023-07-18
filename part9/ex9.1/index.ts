import express from "express";
import { calculateBMI } from "./bmiCalculator";

const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight)) {
    res.json({ error: "malformed parameters" });
  }
  res.json({ ...req.query, bmi: calculateBMI(height, weight) });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
