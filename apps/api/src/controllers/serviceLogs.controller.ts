import type { Request, Response } from "express";
import { serviceLogInputSchema } from "@firearmour/shared";
import * as serviceLogsService from "../services/serviceLogs.service.js";

export async function list(req: Request, res: Response) {
  const logs = await serviceLogsService.listServiceLogs(req.businessId!, req.params.unitId!);
  res.json(logs);
}

export async function create(req: Request, res: Response) {
  const input = serviceLogInputSchema.parse(req.body);
  const log = await serviceLogsService.createServiceLog(req.businessId!, req.params.unitId!, input);
  res.status(201).json(log);
}

export async function update(req: Request, res: Response) {
  const input = serviceLogInputSchema.partial().parse(req.body);
  const log = await serviceLogsService.updateServiceLog(req.businessId!, req.params.id!, input);
  res.json(log);
}

export async function remove(req: Request, res: Response) {
  await serviceLogsService.deleteServiceLog(req.businessId!, req.params.id!);
  res.status(204).end();
}
