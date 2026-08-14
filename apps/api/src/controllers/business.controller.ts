import type { Request, Response } from "express";
import { businessProfileInputSchema, portalAccessInputSchema } from "@firearmour/shared";
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

export async function listStaff(req: Request, res: Response) {
  const staff = await businessService.listStaff(req.businessId!);
  res.json(staff);
}

export async function inviteStaff(req: Request, res: Response) {
  const input = portalAccessInputSchema.parse(req.body);
  const staff = await businessService.inviteStaff(req.businessId!, input.email);
  res.status(201).json(staff);
}

export async function revokeStaff(req: Request, res: Response) {
  await businessService.revokeStaff(req.businessId!, req.params.id!);
  res.status(204).end();
}
