import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as exportController from "../controllers/export.controller.js";

const router = Router();

router.get("/customers.pdf", asyncHandler(exportController.customersPdf));
router.get("/units.pdf", asyncHandler(exportController.unitsPdf));

export default router;
