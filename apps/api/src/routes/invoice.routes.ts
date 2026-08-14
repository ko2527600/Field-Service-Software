import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as invoiceController from "../controllers/invoice.controller.js";

const router = Router();

router.get("/", asyncHandler(invoiceController.list));
router.post("/", asyncHandler(invoiceController.create));
router.get("/:id", asyncHandler(invoiceController.get));
router.delete("/:id", asyncHandler(invoiceController.remove));
router.get("/:id/pdf", asyncHandler(invoiceController.pdf));
router.post("/:id/payment-link", asyncHandler(invoiceController.createPaymentLink));

export default router;
