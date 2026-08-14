import type { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service.js";

export async function summary(req: Request, res: Response) {
  const data = await dashboardService.getSummary(req.businessId!);
  res.json(data);
}

export async function priorityList(req: Request, res: Response) {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const data = await dashboardService.getPriorityList(req.businessId!, limit);
  res.json(data);
}

export async function analytics(req: Request, res: Response) {
  const data = await dashboardService.getAnalytics(req.businessId!);
  res.json(data);
}
