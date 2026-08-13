import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as businessController from "../controllers/business.controller.js";

const router = Router();

router.get("/", asyncHandler(businessController.get));
router.patch("/", asyncHandler(businessController.update));

export default router;
