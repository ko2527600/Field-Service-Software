import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as remindersController from "../controllers/reminders.controller.js";

const router = Router();

router.post("/run", asyncHandler(remindersController.run));

export default router;
