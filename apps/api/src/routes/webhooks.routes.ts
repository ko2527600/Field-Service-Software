import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as webhooksController from "../controllers/webhooks.controller.js";

const router = Router();

// Unauthenticated by design -- these are called by Hubtel's servers, not a logged-in user.
router.post("/hubtel", asyncHandler(webhooksController.hubtel));

export default router;
