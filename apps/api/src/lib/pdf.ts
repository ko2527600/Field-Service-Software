import PDFDocument from "pdfkit";
import type { Response } from "express";
import type { Prisma } from "@prisma/client";

type InvoiceForPdf = Prisma.InvoiceGetPayload<{
  include: {
    business: true;
    customer: true;
    lineItems: { include: { unit: true } };
  };
}>;

const BRAND_RED = "#dc2626";
const DARK = "#111827";
const GRAY = "#6b7280";

function money(value: Prisma.Decimal | number): string {
  return `$${Number(value).toFixed(2)}`;
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function streamInvoicePdf(res: Response, invoice: InvoiceForPdf) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${invoice.invoiceNumber}.pdf"`);
  doc.pipe(res);

  // Header: business letterhead + INVOICE title
  doc.fillColor(BRAND_RED).fontSize(20).font("Helvetica-Bold").text(invoice.business.name, 50, 50);
  doc.fillColor(GRAY).fontSize(9).font("Helvetica");
  const businessLines = [
    [invoice.business.addressLine1, invoice.business.addressLine2].filter(Boolean).join(", "),
    [invoice.business.city, invoice.business.state, invoice.business.postalCode].filter(Boolean).join(", "),
    invoice.business.phone,
    [invoice.business.email, invoice.business.email2].filter(Boolean).join(" / "),
  ].filter(Boolean) as string[];
  let y = 74;
  for (const line of businessLines) {
    doc.text(line, 50, y);
    y += 12;
  }

  doc.fillColor(DARK).fontSize(22).font("Helvetica-Bold").text("INVOICE", 350, 50, { width: 195, align: "right" });
  doc.fillColor(GRAY).fontSize(10).font("Helvetica");
  doc.text(invoice.invoiceNumber, 350, 78, { width: 195, align: "right" });
  doc.text(`Issued: ${formatDate(invoice.issueDate)}`, 350, 92, { width: 195, align: "right" });
  doc.text(`Due: ${formatDate(invoice.dueDate)}`, 350, 106, { width: 195, align: "right" });

  doc
    .moveTo(50, 150)
    .lineTo(545, 150)
    .strokeColor(BRAND_RED)
    .lineWidth(2)
    .stroke();

  // Bill to
  doc.fillColor(GRAY).fontSize(9).font("Helvetica-Bold").text("BILL TO", 50, 165);
  doc.fillColor(DARK).fontSize(11).font("Helvetica-Bold").text(invoice.customer.name, 50, 180);
  doc.fillColor(GRAY).fontSize(9).font("Helvetica");
  const customerLines = [
    [invoice.customer.addressLine1, invoice.customer.addressLine2].filter(Boolean).join(", "),
    [invoice.customer.city, invoice.customer.state, invoice.customer.postalCode].filter(Boolean).join(", "),
    invoice.customer.contactPhone,
    invoice.customer.contactEmail,
  ].filter(Boolean) as string[];
  y = 196;
  for (const line of customerLines) {
    doc.text(line, 50, y);
    y += 12;
  }

  // Line items table
  const tableTop = 260;
  const cols = { desc: 50, type: 260, qty: 360, price: 410, total: 480 };
  doc.fillColor("#ffffff").rect(50, tableTop, 495, 20).fill(BRAND_RED);
  doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
  doc.text("DESCRIPTION", cols.desc + 6, tableTop + 6);
  doc.text("SERVICE", cols.type, tableTop + 6);
  doc.text("QTY", cols.qty, tableTop + 6);
  doc.text("PRICE", cols.price, tableTop + 6);
  doc.text("TOTAL", cols.total, tableTop + 6, { width: 60, align: "right" });

  let rowY = tableTop + 28;
  doc.font("Helvetica").fontSize(9);
  for (const item of invoice.lineItems) {
    doc.fillColor(DARK).text(item.description, cols.desc + 6, rowY, { width: 200 });
    doc.fillColor(GRAY).text(item.serviceType ?? "—", cols.type, rowY, { width: 90 });
    doc.text(String(item.quantity), cols.qty, rowY);
    doc.text(money(item.unitPrice), cols.price, rowY);
    doc.fillColor(DARK).text(money(item.lineTotal), cols.total, rowY, { width: 60, align: "right" });
    rowY += 22;
  }

  doc.moveTo(50, rowY + 4).lineTo(545, rowY + 4).strokeColor("#e5e7eb").lineWidth(1).stroke();

  // Totals
  let totalsY = rowY + 16;
  doc.fillColor(GRAY).fontSize(10).text("Subtotal", 400, totalsY, { width: 85 });
  doc.fillColor(DARK).text(money(invoice.subtotal), cols.total, totalsY, { width: 60, align: "right" });
  totalsY += 18;
  doc.fillColor(DARK).fontSize(12).font("Helvetica-Bold").text("Total", 400, totalsY, { width: 85 });
  doc.text(money(invoice.total), cols.total, totalsY, { width: 60, align: "right" });

  if (invoice.notes) {
    totalsY += 40;
    doc.fillColor(GRAY).fontSize(9).font("Helvetica-Bold").text("NOTES", 50, totalsY);
    doc.fillColor(DARK).font("Helvetica").text(invoice.notes, 50, totalsY + 14, { width: 495 });
  }

  doc.end();
}
