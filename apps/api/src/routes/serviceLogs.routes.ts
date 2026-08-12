import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as serviceLogsController from "../controllers/serviceLogs.controller.js";

const router = Router();

router.patch("/:id", asyncHandler(serviceLogsController.update));
router.delete("/:id", asyncHandler(serviceLogsController.remove));

export default router;
