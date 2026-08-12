import type { Request, Response } from "express";
import * as exportService from "../services/export.service.js";

export async function customersCsv(_req: Request, res: Response) {
  const csv = await exportService.exportCustomersCsv();
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="ledgio-customers-${date}.csv"`);
  res.send(csv);
}

export async function unitsCsv(_req: Request, res: Response) {
  const csv = await exportService.exportUnitsCsv();
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="ledgio-units-${date}.csv"`);
  res.send(csv);
}
