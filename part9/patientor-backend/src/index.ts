import express, { Request } from "express";
import cors from "cors";
import diagnosesRouter from "./routes/diagnoses";

const app = express();
app.use(cors<Request>());
app.use(express.json());

app.use("/api/diagnoses", diagnosesRouter);

app.get("/api/ping", (_req, res) => {
  res.json({ data: "ping received" }).send();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
