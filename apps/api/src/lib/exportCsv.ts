import type { Response } from "express";

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsvRow(values: string[]): string {
  return values.map(escapeCsvField).join(",") + "\r\n";
}

export function streamCsv(res: Response, filename: string, headers: string[], rows: string[][]) {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.write(toCsvRow(headers));
  for (const row of rows) {
    res.write(toCsvRow(row));
  }
  res.end();
}
