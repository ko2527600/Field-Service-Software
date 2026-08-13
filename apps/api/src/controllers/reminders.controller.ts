import type { Request, Response } from "express";
import * as remindersService from "../services/reminders.service.js";

export async function run(req: Request, res: Response) {
  const result = await remindersService.sendDueRenewalReminders(req.businessId!);
  res.json(result);
}
