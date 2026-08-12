import { getUnitStatus } from "@ledgio/shared";
import { prisma } from "../lib/prisma.js";
import { getDefaultBusinessId } from "../lib/business.js";
import { serializeUnit } from "./units.service.js";

export async function getSummary() {
  const businessId = await getDefaultBusinessId();

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

export async function getPriorityList(limit = 50) {
  const businessId = await getDefaultBusinessId();

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
