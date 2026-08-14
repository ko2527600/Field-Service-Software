import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as businessController from "../controllers/business.controller.js";

const router = Router();

router.get("/", asyncHandler(businessController.get));
router.patch("/", asyncHandler(businessController.update));

router.get("/staff", asyncHandler(businessController.listStaff));
router.post("/staff", asyncHandler(businessController.inviteStaff));
router.delete("/staff/:id", asyncHandler(businessController.revokeStaff));

export default router;
