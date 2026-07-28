import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "./utils/logger.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Placeholder routes
app.get("/", (_req, res) => {
  res.json({ message: "Marmu API", version: "1.0.0" });
});

export default app;
