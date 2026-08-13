import type { Request, Response } from "express";
import { createInvoiceSchema } from "@firearmour/shared";
import * as invoiceService from "../services/invoice.service.js";
import { streamInvoicePdf } from "../lib/pdf.js";

export async function list(req: Request, res: Response) {
  const customerId = typeof req.query.customerId === "string" ? req.query.customerId : undefined;
  const invoices = await invoiceService.listInvoices(req.businessId!, customerId);
  res.json(invoices);
}

export async function get(req: Request, res: Response) {
  const invoice = await invoiceService.getInvoice(req.businessId!, req.params.id!);
  res.json(invoice);
}

export async function create(req: Request, res: Response) {
  const input = createInvoiceSchema.parse(req.body);
  const invoice = await invoiceService.createInvoice(req.businessId!, input);
  res.status(201).json(invoice);
}

export async function remove(req: Request, res: Response) {
  await invoiceService.deleteInvoice(req.businessId!, req.params.id!);
  res.status(204).end();
}

export async function pdf(req: Request, res: Response) {
  const invoice = await invoiceService.getInvoice(req.businessId!, req.params.id!);
  streamInvoicePdf(res, invoice);
}
