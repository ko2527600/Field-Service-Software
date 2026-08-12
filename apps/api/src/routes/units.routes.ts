import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as unitsController from "../controllers/units.controller.js";
import * as serviceLogsController from "../controllers/serviceLogs.controller.js";

const router = Router();

router.get("/", asyncHandler(unitsController.list));
router.get("/:id", asyncHandler(unitsController.get));
router.patch("/:id", asyncHandler(unitsController.update));
router.delete("/:id", asyncHandler(unitsController.remove));

router.get("/:unitId/service-logs", asyncHandler(serviceLogsController.list));
router.post("/:unitId/service-logs", asyncHandler(serviceLogsController.create));

export default router;
