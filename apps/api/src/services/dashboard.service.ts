import { getUnitStatus } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { serializeUnit } from "./units.service.js";

export async function getSummary(businessId: string) {
  const [units, totalCustomers] = await Promise.all([
    prisma.unit.findMany({
      where: { archivedAt: null, customer: { businessId, archivedAt: null } },
      select: { renewalDate: true },
    }),
    prisma.customer.count({ where: { businessId, archivedAt: null } }),
  ]);

  const counts = { activeCount: 0, dueSoonCount: 0, expiredCount: 0 };
  for (const unit of units) {
    const status = getUnitStatus(unit.renewalDate);
    if (status === "ACTIVE") counts.activeCount++;
    else if (status === "DUE_SOON") counts.dueSoonCount++;
    else counts.expiredCount++;
  }

  return {
    ...counts,
    totalUnits: units.length,
    totalCustomers,
  };
}

export async function getPriorityList(businessId: string, limit = 50) {
  const units = await prisma.unit.findMany({
    where: { archivedAt: null, customer: { businessId, archivedAt: null } },
    include: { customer: { select: { name: true } } },
    orderBy: { renewalDate: "asc" },
    take: limit,
  });

  // Sorting by renewalDate ASC already surfaces Expired (past dates), then
  // Due Soon, then Active in the right order — no extra grouping needed.
  return units.map(serializeUnit);
}

const MONTH_LABEL_OPTS: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };

export function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-US", MONTH_LABEL_OPTS);
}

export function startOfUTCMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1));
}

/**
 * Fleet-wide compliance analytics for the admin dashboard: a status
 * breakdown for a pie chart, and two revenue views for a bar chart --
 * (a) an *estimated* figure for the next 6 months, derived from how many
 * units are due each month times the business's average historical service
 * charge (there's no fixed per-renewal price on a Unit, so this is
 * necessarily an approximation, and labeled as such in the UI), and
 * (b) *actual* invoice revenue for the trailing 6 months, which is real data.
 */
export async function getAnalytics(businessId: string) {
  const [units, avgCharge, invoices] = await Promise.all([
    prisma.unit.findMany({
      where: { archivedAt: null, customer: { businessId, archivedAt: null } },
      select: { renewalDate: true },
    }),
    prisma.serviceLog.aggregate({
      _avg: { amountCharged: true },
      where: { unit: { customer: { businessId, archivedAt: null } } },
    }),
    prisma.invoice.findMany({
      where: { businessId },
      select: { issueDate: true, total: true },
    }),
  ]);

  const statusBreakdown = { ACTIVE: 0, DUE_SOON: 0, EXPIRED: 0 };
  for (const unit of units) {
    statusBreakdown[getUnitStatus(unit.renewalDate)] += 1;
  }

  const averageServiceCharge = Number(avgCharge._avg.amountCharged ?? 0);
  const now = new Date();

  const upcomingRenewals = Array.from({ length: 6 }, (_, i) => {
    const bucketStart = startOfUTCMonth(now.getUTCFullYear(), now.getUTCMonth() + i);
    const bucketEnd = startOfUTCMonth(now.getUTCFullYear(), now.getUTCMonth() + i + 1);
    const dueCount = units.filter((u) => u.renewalDate >= bucketStart && u.renewalDate < bucketEnd).length;
    return {
      month: monthLabel(bucketStart),
      dueCount,
      estimatedRevenue: Math.round(dueCount * averageServiceCharge * 100) / 100,
    };
  });

  const invoiceRevenueByMonth = new Map<string, number>();
  for (const invoice of invoices) {
    const label = monthLabel(invoice.issueDate);
    invoiceRevenueByMonth.set(label, (invoiceRevenueByMonth.get(label) ?? 0) + Number(invoice.total));
  }
  const actualRevenue = Array.from({ length: 6 }, (_, i) => {
    const bucketStart = startOfUTCMonth(now.getUTCFullYear(), now.getUTCMonth() - (5 - i));
    const label = monthLabel(bucketStart);
    return { month: label, revenue: Math.round((invoiceRevenueByMonth.get(label) ?? 0) * 100) / 100 };
  });

  return { statusBreakdown, upcomingRenewals, actualRevenue };
}
