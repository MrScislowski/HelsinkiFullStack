import express from "express";
import { calculateBMI } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json());

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

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  const target_hours = Number(target);
  if (isNaN(target_hours)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  for (const hourVal of daily_exercises) {
    if (isNaN(Number(hourVal)))
      return res.status(400).json({ error: "malformatted parameters" });
  }

  const hourArray: number[] = daily_exercises.map((el) => Number(el));
  return res.json(calculateExercises(hourArray, target_hours));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
