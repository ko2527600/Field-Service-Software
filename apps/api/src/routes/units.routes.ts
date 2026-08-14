import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { requireAdmin } from "../middleware/auth.js";
import * as unitsController from "../controllers/units.controller.js";
import * as serviceLogsController from "../controllers/serviceLogs.controller.js";

const router = Router();

router.get("/", asyncHandler(unitsController.list));
router.get("/lookup", asyncHandler(unitsController.lookup));
router.get("/:id", asyncHandler(unitsController.get));
router.patch("/:id", requireAdmin, asyncHandler(unitsController.update));
router.delete("/:id", requireAdmin, asyncHandler(unitsController.remove));

router.get("/:unitId/service-logs", asyncHandler(serviceLogsController.list));
router.post("/:unitId/service-logs", asyncHandler(serviceLogsController.create));

export default router;
