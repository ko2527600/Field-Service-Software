import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as exportController from "../controllers/export.controller.js";

const router = Router();

router.get("/customers.csv", asyncHandler(exportController.customersCsv));
router.get("/units.csv", asyncHandler(exportController.unitsCsv));

export default router;
