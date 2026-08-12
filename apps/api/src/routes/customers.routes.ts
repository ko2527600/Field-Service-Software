import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import * as customersController from "../controllers/customers.controller.js";
import * as unitsController from "../controllers/units.controller.js";

const router = Router();

router.get("/", asyncHandler(customersController.list));
router.get("/:id", asyncHandler(customersController.get));
router.post("/", asyncHandler(customersController.create));
router.patch("/:id", asyncHandler(customersController.update));
router.delete("/:id", asyncHandler(customersController.remove));

// Unit creation is scoped to a customer; reads/updates/deletes of a unit
// happen via the flat /units routes since a unit is addressed by its own id.
router.post("/:customerId/units", asyncHandler(unitsController.create));

export default router;
