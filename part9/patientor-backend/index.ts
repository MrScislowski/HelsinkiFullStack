import express from "express";

const app = express();

app.get("/api/ping", (_req, res) => {
  res.json({ data: "ping received" }).send();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
