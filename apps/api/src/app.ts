import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/v1/auth", authRoutes);

// Placeholder root
app.get("/", (_req, res) => {
  res.json({ message: "Marmu API", version: "1.0.0" });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ error: err.message, stack: err.stack }, "Unhandled error");
  res.status(500).json({
    success: false,
    error: {
      type: "https://api.marmu.app/errors/internal-server-error",
      title: "Internal Server Error",
      status: 500,
      detail: "Erro interno do servidor",
    },
  });
});

export default app;
