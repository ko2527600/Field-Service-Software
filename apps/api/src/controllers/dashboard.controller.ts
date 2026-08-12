import type { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service.js";

export async function summary(_req: Request, res: Response) {
  const data = await dashboardService.getSummary();
  res.json(data);
}

export async function priorityList(req: Request, res: Response) {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const data = await dashboardService.getPriorityList(limit);
  res.json(data);
}
