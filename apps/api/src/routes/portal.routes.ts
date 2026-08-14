import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as portalController from "../controllers/portal.controller.js";

const router = Router();

router.get("/me", asyncHandler(portalController.me));
router.get("/units", asyncHandler(portalController.units));
router.get("/invoices", asyncHandler(portalController.invoices));
router.get("/invoices/:id/pdf", asyncHandler(portalController.invoicePdf));

export default router;
