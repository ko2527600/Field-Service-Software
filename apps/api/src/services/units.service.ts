import type { Unit } from "@prisma/client";
import { getUnitStatus, computeNextRenewalDate, type UnitStatus } from "@firearmour/shared";
import type { UnitInput, UnitUpdateInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";

export type UnitWithStatus = Unit & { status: UnitStatus; customerName?: string };

export function serializeUnit(unit: Unit & { customer?: { name: string } | null }): UnitWithStatus {
  const { customer, ...rest } = unit;
  return {
    ...rest,
    status: getUnitStatus(unit.renewalDate),
    customerName: customer?.name,
  };
}

export type UnitListFilters = {
  status?: UnitStatus;
  customerId?: string;
  sort?: "renewalDate:asc" | "renewalDate:desc";
};

export async function listUnits(businessId: string, filters: UnitListFilters) {
  const units = await prisma.unit.findMany({
    where: {
      archivedAt: null,
      customerId: filters.customerId,
      customer: { businessId },
    },
    include: { customer: { select: { name: true } } },
    orderBy: { renewalDate: filters.sort === "renewalDate:desc" ? "desc" : "asc" },
  });

  const serialized = units.map(serializeUnit);
  if (filters.status) {
    return serialized.filter((u) => u.status === filters.status);
  }
  return serialized;
}

/** Fallback lookup for scanning a pre-existing manufacturer barcode that encodes a serial number instead of our own QR deep link. */
export async function getUnitBySerial(businessId: string, serialNumber: string) {
  const unit = await prisma.unit.findFirst({
    where: { serialNumber, archivedAt: null, customer: { businessId, archivedAt: null } },
    include: {
      customer: { select: { name: true, businessId: true } },
      serviceLogs: { orderBy: { serviceDate: "desc" } },
    },
  });
  if (!unit) {
    throw new HttpError(404, "Unit not found");
  }
  return serializeUnit(unit);
}

export async function getUnit(businessId: string, id: string) {
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, businessId: true } },
      serviceLogs: { orderBy: { serviceDate: "desc" } },
    },
  });
  if (!unit || unit.archivedAt || unit.customer?.businessId !== businessId) {
    throw new HttpError(404, "Unit not found");
  }
  return serializeUnit(unit);
}

export async function createUnit(businessId: string, customerId: string, input: UnitInput) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer || customer.archivedAt || customer.businessId !== businessId) {
    throw new HttpError(404, "Customer not found");
  }

  const renewalDate = computeNextRenewalDate(
    input.installDate,
    input.renewalPeriod,
    input.customIntervalDays,
  );

  const unit = await prisma.unit.create({
    data: {
      customerId,
      type: input.type,
      size: input.size,
      serialNumber: input.serialNumber,
      installDate: input.installDate,
      renewalPeriod: input.renewalPeriod,
      customIntervalDays: input.customIntervalDays,
      location: input.location || null,
      renewalDate,
    },
    include: { customer: { select: { name: true } } },
  });
  return serializeUnit(unit);
}

export async function updateUnit(businessId: string, id: string, input: UnitUpdateInput) {
  const existing = await prisma.unit.findUnique({ where: { id }, include: { customer: true } });
  if (!existing || existing.archivedAt || existing.customer.businessId !== businessId) {
    throw new HttpError(404, "Unit not found");
  }

  const unit = await prisma.unit.update({
    where: { id },
    data: {
      type: input.type,
      size: input.size,
      serialNumber: input.serialNumber,
      installDate: input.installDate,
      renewalPeriod: input.renewalPeriod,
      customIntervalDays: input.customIntervalDays,
      renewalDate: input.renewalDate,
      location: input.location,
    },
    include: { customer: { select: { name: true } } },
  });
  return serializeUnit(unit);
}

export async function archiveUnit(businessId: string, id: string) {
  const existing = await prisma.unit.findUnique({ where: { id }, include: { customer: true } });
  if (!existing || existing.archivedAt || existing.customer.businessId !== businessId) {
    throw new HttpError(404, "Unit not found");
  }
  await prisma.unit.update({ where: { id }, data: { archivedAt: new Date() } });
}
