import PDFDocument from "pdfkit";
import type { Response } from "express";

const BRAND_RED = "#dc2626";
const DARK = "#111827";
const GRAY = "#6b7280";

const PAGE_LEFT = 50;
const PAGE_RIGHT = 545;
const TABLE_WIDTH = PAGE_RIGHT - PAGE_LEFT;
const ROW_BOTTOM_LIMIT = 760;

type Column = { key: string; label: string; width: number };

function drawHeader(doc: PDFKit.PDFDocument, title: string, businessName: string) {
  doc.fillColor(BRAND_RED).fontSize(20).font("Helvetica-Bold").text(businessName, PAGE_LEFT, 50);
  doc.fillColor(DARK).fontSize(16).font("Helvetica-Bold").text(title, PAGE_LEFT, 78);
  const generated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  doc.fillColor(GRAY).fontSize(9).font("Helvetica").text(`Generated ${generated}`, PAGE_LEFT, 100);
  doc.moveTo(PAGE_LEFT, 120).lineTo(PAGE_RIGHT, 120).strokeColor(BRAND_RED).lineWidth(2).stroke();
}

function drawTableHeaderRow(doc: PDFKit.PDFDocument, columns: Column[], y: number) {
  doc.fillColor("#ffffff").rect(PAGE_LEFT, y, TABLE_WIDTH, 20).fill(BRAND_RED);
  doc.fillColor("#ffffff").fontSize(8).font("Helvetica-Bold");
  let x = PAGE_LEFT;
  for (const col of columns) {
    doc.text(col.label.toUpperCase(), x + 4, y + 6, { width: col.width - 4 });
    x += col.width;
  }
  return y + 24;
}

function drawTable(doc: PDFKit.PDFDocument, columns: Column[], rows: Record<string, string>[], startY: number) {
  let y = drawTableHeaderRow(doc, columns, startY);
  doc.font("Helvetica").fontSize(8);

  for (const row of rows) {
    if (y > ROW_BOTTOM_LIMIT) {
      doc.addPage();
      y = drawTableHeaderRow(doc, columns, 50);
      doc.font("Helvetica").fontSize(8);
    }
    let x = PAGE_LEFT;
    for (const col of columns) {
      doc.fillColor(DARK).text(row[col.key] ?? "", x + 4, y, { width: col.width - 8 });
      x += col.width;
    }
    y += 28;
    doc
      .moveTo(PAGE_LEFT, y - 4)
      .lineTo(PAGE_LEFT + TABLE_WIDTH, y - 4)
      .strokeColor("#e5e7eb")
      .lineWidth(0.5)
      .stroke();
  }

  if (rows.length === 0) {
    doc.fillColor(GRAY).fontSize(9).font("Helvetica").text("No records to export.", PAGE_LEFT, y + 8);
  }
}

function attachAndStream(res: Response, filenamePrefix: string, build: (doc: PDFKit.PDFDocument) => void) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filenamePrefix}-${date}.pdf"`);
  doc.pipe(res);
  build(doc);
  doc.end();
}

export function streamUnitsPdf(res: Response, businessName: string, rows: Record<string, string>[]) {
  attachAndStream(res, "firearmour-units", (doc) => {
    drawHeader(doc, "Extinguishers & Status", businessName);
    drawTable(
      doc,
      [
        { key: "customerName", label: "Customer", width: 85 },
        { key: "type", label: "Type", width: 85 },
        { key: "size", label: "Size", width: 45 },
        { key: "serialNumber", label: "Serial", width: 70 },
        { key: "location", label: "Location", width: 55 },
        { key: "renewalDate", label: "Renewal", width: 60 },
        { key: "status", label: "Status", width: 95 },
      ],
      rows,
      132,
    );
  });
}

export function streamCustomersPdf(res: Response, businessName: string, rows: Record<string, string>[]) {
  attachAndStream(res, "firearmour-customers", (doc) => {
    drawHeader(doc, "Customers", businessName);
    drawTable(
      doc,
      [
        { key: "name", label: "Name", width: 110 },
        { key: "contactPhone", label: "Phone", width: 80 },
        { key: "contactEmail", label: "Email", width: 140 },
        { key: "city", label: "City", width: 80 },
        { key: "unitCount", label: "Units", width: 85 },
      ],
      rows,
      132,
    );
  });
}
