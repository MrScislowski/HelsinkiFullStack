import express from "express";

const app = express();

app.get("/api/ping", (_req, res) => {
  res.send("ping received");
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
