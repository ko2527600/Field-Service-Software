import { EXTINGUISHER_TYPE_LABELS, UNIT_STATUS_LABELS } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { serializeUnit } from "./units.service.js";

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

/** AFCAS-ready export: one row per unit with exactly the fields government compliance portals expect. */
export const AFCAS_EXPORT_HEADERS = [
  "Client Name",
  "Location",
  "Extinguisher Type",
  "Serial Number",
  "Installation Date",
  "Last Service Date",
  "Expiry Date",
];

export async function getAfcasExportRows(businessId: string): Promise<string[][]> {
  const units = await prisma.unit.findMany({
    where: { archivedAt: null, customer: { businessId, archivedAt: null } },
    include: {
      customer: { select: { name: true } },
      serviceLogs: { orderBy: { serviceDate: "desc" }, take: 1, select: { serviceDate: true } },
    },
    orderBy: { renewalDate: "asc" },
  });

  return units.map((unit) => [
    unit.customer?.name ?? "",
    unit.location ?? "",
    EXTINGUISHER_TYPE_LABELS[unit.type],
    unit.serialNumber,
    toIsoDate(unit.installDate),
    unit.serviceLogs[0] ? toIsoDate(unit.serviceLogs[0].serviceDate) : "",
    toIsoDate(unit.renewalDate),
  ]);
}

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
