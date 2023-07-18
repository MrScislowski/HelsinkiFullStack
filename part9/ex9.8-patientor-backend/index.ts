import express, { NextFunction, Request, Response } from "express";
const app = express();
app.use(express.json());

const PORT = 3001;

const allowCrossDomain = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
};

app.use(allowCrossDomain);

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
