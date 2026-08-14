import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.js";
import { requireAuth, requireAdmin, requirePortalAccess } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.routes.js";
import businessRouter from "./routes/business.routes.js";
import customersRouter from "./routes/customers.routes.js";
import unitsRouter from "./routes/units.routes.js";
import serviceLogsRouter from "./routes/serviceLogs.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import exportRouter from "./routes/export.routes.js";
import invoiceRouter from "./routes/invoice.routes.js";
import remindersRouter from "./routes/reminders.routes.js";
import portalRouter from "./routes/portal.routes.js";

export function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/v1/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/business", requireAuth, requireAdmin, businessRouter);
  app.use("/api/v1/customers", requireAuth, requireAdmin, customersRouter);
  app.use("/api/v1/units", requireAuth, requireAdmin, unitsRouter);
  app.use("/api/v1/service-logs", requireAuth, requireAdmin, serviceLogsRouter);
  app.use("/api/v1/dashboard", requireAuth, requireAdmin, dashboardRouter);
  app.use("/api/v1/export", requireAuth, requireAdmin, exportRouter);
  app.use("/api/v1/invoices", requireAuth, requireAdmin, invoiceRouter);
  app.use("/api/v1/reminders", requireAuth, requireAdmin, remindersRouter);
  app.use("/api/v1/portal", requireAuth, requirePortalAccess, portalRouter);

  app.use(errorHandler);

  return app;
}
