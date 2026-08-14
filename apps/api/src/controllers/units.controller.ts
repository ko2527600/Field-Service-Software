import type { Request, Response } from "express";
import { unitInputSchema, unitUpdateSchema } from "@firearmour/shared";
import { unitListQuerySchema } from "../validation/query.schema.js";
import * as unitsService from "../services/units.service.js";

export async function list(req: Request, res: Response) {
  const query = unitListQuerySchema.parse(req.query);
  const units = await unitsService.listUnits(req.businessId!, query);
  res.json(units);
}

export async function get(req: Request, res: Response) {
  const unit = await unitsService.getUnit(req.businessId!, req.params.id!);
  res.json(unit);
}

export async function lookup(req: Request, res: Response) {
  const serial = typeof req.query.serial === "string" ? req.query.serial.trim() : "";
  if (!serial) {
    res.status(400).json({ message: "serial query param is required" });
    return;
  }
  const unit = await unitsService.getUnitBySerial(req.businessId!, serial);
  res.json(unit);
}

export async function create(req: Request, res: Response) {
  const input = unitInputSchema.parse(req.body);
  const unit = await unitsService.createUnit(req.businessId!, req.params.customerId!, input);
  res.status(201).json(unit);
}

export async function update(req: Request, res: Response) {
  const input = unitUpdateSchema.parse(req.body);
  const unit = await unitsService.updateUnit(req.businessId!, req.params.id!, input);
  res.json(unit);
}

export async function remove(req: Request, res: Response) {
  await unitsService.archiveUnit(req.businessId!, req.params.id!);
  res.status(204).end();
}
