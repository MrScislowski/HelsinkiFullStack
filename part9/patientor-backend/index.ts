import express, { Request } from "express";
import cors from "cors";

const app = express();
app.use(cors<Request>());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  res.json({ data: "ping received" }).send();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
