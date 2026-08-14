import type { Request, Response } from "express";
import * as portalService from "../services/portal.service.js";
import { streamInvoicePdf } from "../lib/pdf.js";

export async function me(req: Request, res: Response) {
  const info = await portalService.getPortalMe(req.userId!, req.customerId!);
  res.json(info);
}

export async function units(req: Request, res: Response) {
  const list = await portalService.getPortalUnits(req.customerId!);
  res.json(list);
}

export async function invoices(req: Request, res: Response) {
  const list = await portalService.getPortalInvoices(req.customerId!);
  res.json(list);
}

export async function invoicePdf(req: Request, res: Response) {
  const invoice = await portalService.getPortalInvoice(req.customerId!, req.params.id!);
  streamInvoicePdf(res, invoice);
}
