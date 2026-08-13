import type { Request, Response } from "express";
import * as exportService from "../services/export.service.js";

export async function customersCsv(req: Request, res: Response) {
  const csv = await exportService.exportCustomersCsv(req.businessId!);
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="firearmour-customers-${date}.csv"`);
  res.send(csv);
}

export async function unitsCsv(req: Request, res: Response) {
  const csv = await exportService.exportUnitsCsv(req.businessId!);
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="firearmour-units-${date}.csv"`);
  res.send(csv);
}
