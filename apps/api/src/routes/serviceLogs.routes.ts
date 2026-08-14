import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAdmin } from "../middleware/auth.js";
import * as serviceLogsController from "../controllers/serviceLogs.controller.js";

const router = Router();

// Editing/deleting a past service log is an admin/audit action -- technicians
// can create new logs (their core job) but shouldn't be able to quietly alter
// the compliance record after the fact.
router.patch("/:id", requireAdmin, asyncHandler(serviceLogsController.update));
router.delete("/:id", requireAdmin, asyncHandler(serviceLogsController.remove));

export default router;
