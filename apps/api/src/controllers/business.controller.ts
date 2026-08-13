import type { Request, Response } from "express";
import { businessProfileInputSchema } from "@firearmour/shared";
import * as businessService from "../services/business.service.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function get(req: Request, res: Response) {
  if (!req.businessId) throw new HttpError(401, "Not authenticated");
  const business = await businessService.getBusinessProfile(req.businessId);
  res.json(business);
}

export async function update(req: Request, res: Response) {
  if (!req.businessId) throw new HttpError(401, "Not authenticated");
  const input = businessProfileInputSchema.parse(req.body);
  const business = await businessService.updateBusinessProfile(req.businessId, input);
  res.json(business);
}
