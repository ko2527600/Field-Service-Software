import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAdmin } from "../middleware/auth.js";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/summary", asyncHandler(dashboardController.summary));
router.get("/priority-list", asyncHandler(dashboardController.priorityList));
// Revenue/analytics data is admin-only -- not a field tech's business.
router.get("/analytics", requireAdmin, asyncHandler(dashboardController.analytics));

export default router;
