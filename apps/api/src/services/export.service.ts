import { UNIT_STATUS_LABELS } from "@ledgio/shared";
import { prisma } from "../lib/prisma.js";
import { getDefaultBusinessId } from "../lib/business.js";
import { serializeUnit } from "./units.service.js";
import { toCsv } from "../lib/csv.js";

export async function exportUnitsCsv(): Promise<string> {
  const businessId = await getDefaultBusinessId();
  const units = await prisma.unit.findMany({
    where: { archivedAt: null, customer: { businessId, archivedAt: null } },
    include: { customer: { select: { name: true, contactPhone: true, contactEmail: true } } },
    orderBy: { renewalDate: "asc" },
  });

  const rows = units.map((unit) => {
    const serialized = serializeUnit(unit);
    return {
      customerName: unit.customer?.name,
      contactPhone: unit.customer?.contactPhone,
      contactEmail: unit.customer?.contactEmail,
      type: unit.type,
      size: unit.size,
      serialNumber: unit.serialNumber,
      location: unit.location,
      installDate: unit.installDate.toISOString().slice(0, 10),
      renewalPeriod: unit.renewalPeriod,
      renewalDate: unit.renewalDate.toISOString().slice(0, 10),
      status: UNIT_STATUS_LABELS[serialized.status],
    };
  });

  return toCsv(rows, [
    "customerName",
    "contactPhone",
    "contactEmail",
    "type",
    "size",
    "serialNumber",
    "location",
    "installDate",
    "renewalPeriod",
    "renewalDate",
    "status",
  ]);
}

export async function exportCustomersCsv(): Promise<string> {
  const businessId = await getDefaultBusinessId();
  const customers = await prisma.customer.findMany({
    where: { businessId, archivedAt: null },
    include: { units: { where: { archivedAt: null } } },
    orderBy: { name: "asc" },
  });

  const rows = customers.map((c) => ({
    name: c.name,
    contactPhone: c.contactPhone,
    contactEmail: c.contactEmail,
    addressLine1: c.addressLine1,
    city: c.city,
    state: c.state,
    postalCode: c.postalCode,
    businessType: c.businessType,
    unitCount: c.units.length,
  }));

  return toCsv(rows, [
    "name",
    "contactPhone",
    "contactEmail",
    "addressLine1",
    "city",
    "state",
    "postalCode",
    "businessType",
    "unitCount",
  ]);
}
