import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/summary", asyncHandler(dashboardController.summary));
router.get("/priority-list", asyncHandler(dashboardController.priorityList));
router.get("/analytics", asyncHandler(dashboardController.analytics));

export default router;
