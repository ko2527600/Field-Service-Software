import type { Request, Response } from "express";
import * as exportService from "../services/export.service.js";
import * as businessService from "../services/business.service.js";
import { streamCustomersPdf, streamUnitsPdf } from "../lib/exportPdf.js";
import { streamCsv } from "../lib/exportCsv.js";

export async function customersPdf(req: Request, res: Response) {
  const [business, rows] = await Promise.all([
    businessService.getBusinessProfile(req.businessId!),
    exportService.getCustomersExportRows(req.businessId!),
  ]);
  streamCustomersPdf(res, business.name, rows);
}

export async function unitsPdf(req: Request, res: Response) {
  const [business, rows] = await Promise.all([
    businessService.getBusinessProfile(req.businessId!),
    exportService.getUnitsExportRows(req.businessId!),
  ]);
  streamUnitsPdf(res, business.name, rows);
}

export async function afcasCsv(req: Request, res: Response) {
  const rows = await exportService.getAfcasExportRows(req.businessId!);
  const filename = `afcas-export-${new Date().toISOString().slice(0, 10)}.csv`;
  streamCsv(res, filename, exportService.AFCAS_EXPORT_HEADERS, rows);
}
