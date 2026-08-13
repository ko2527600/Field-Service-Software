import { EXTINGUISHER_TYPE_LABELS, UNIT_STATUS_LABELS } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { serializeUnit } from "./units.service.js";

export async function getUnitsExportRows(businessId: string): Promise<Record<string, string>[]> {
  const units = await prisma.unit.findMany({
    where: { archivedAt: null, customer: { businessId, archivedAt: null } },
    include: { customer: { select: { name: true, contactPhone: true, contactEmail: true } } },
    orderBy: { renewalDate: "asc" },
  });

  return units.map((unit) => {
    const serialized = serializeUnit(unit);
    return {
      customerName: unit.customer?.name ?? "",
      contactPhone: unit.customer?.contactPhone ?? "",
      contactEmail: unit.customer?.contactEmail ?? "",
      type: EXTINGUISHER_TYPE_LABELS[unit.type],
      size: unit.size,
      serialNumber: unit.serialNumber,
      location: unit.location ?? "",
      installDate: unit.installDate.toISOString().slice(0, 10),
      renewalPeriod: unit.renewalPeriod,
      renewalDate: unit.renewalDate.toISOString().slice(0, 10),
      status: UNIT_STATUS_LABELS[serialized.status],
    };
  });
}

export async function getCustomersExportRows(businessId: string): Promise<Record<string, string>[]> {
  const customers = await prisma.customer.findMany({
    where: { businessId, archivedAt: null },
    include: { units: { where: { archivedAt: null } } },
    orderBy: { name: "asc" },
  });

  return customers.map((c) => ({
    name: c.name,
    contactPhone: c.contactPhone ?? "",
    contactEmail: c.contactEmail ?? "",
    addressLine1: c.addressLine1 ?? "",
    city: c.city ?? "",
    state: c.state ?? "",
    postalCode: c.postalCode ?? "",
    businessType: c.businessType ?? "",
    unitCount: String(c.units.length),
  }));
}
