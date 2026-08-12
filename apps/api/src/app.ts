import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import customersRouter from "./routes/customers.routes.js";
import unitsRouter from "./routes/units.routes.js";
import serviceLogsRouter from "./routes/serviceLogs.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import exportRouter from "./routes/export.routes.js";

export function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());

  app.get("/api/v1/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/v1/customers", requireAuth, customersRouter);
  app.use("/api/v1/units", requireAuth, unitsRouter);
  app.use("/api/v1/service-logs", requireAuth, serviceLogsRouter);
  app.use("/api/v1/dashboard", requireAuth, dashboardRouter);
  app.use("/api/v1/export", requireAuth, exportRouter);

  app.use(errorHandler);

  return app;
}
