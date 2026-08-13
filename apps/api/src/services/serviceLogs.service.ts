import type { ServiceLogInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function listServiceLogs(businessId: string, unitId: string) {
  const unit = await prisma.unit.findUnique({ where: { id: unitId }, include: { customer: true } });
  if (!unit || unit.archivedAt || unit.customer.businessId !== businessId) {
    throw new HttpError(404, "Unit not found");
  }

  return prisma.serviceLog.findMany({
    where: { unitId },
    orderBy: { serviceDate: "desc" },
  });
}

/**
 * Creates a service log entry and updates the unit's renewalDate to the
 * log's nextDueDate, so status always reflects the latest recorded visit
 * while each log entry preserves what was decided at that visit.
 */
export async function createServiceLog(businessId: string, unitId: string, input: ServiceLogInput) {
  const unit = await prisma.unit.findUnique({ where: { id: unitId }, include: { customer: true } });
  if (!unit || unit.archivedAt || unit.customer.businessId !== businessId) {
    throw new HttpError(404, "Unit not found");
  }

  const [log] = await prisma.$transaction([
    prisma.serviceLog.create({
      data: {
        unitId,
        serviceDate: input.serviceDate,
        technician: input.technician || null,
        amountCharged: input.amountCharged,
        notes: input.notes || null,
        nextDueDate: input.nextDueDate,
      },
    }),
    prisma.unit.update({
      where: { id: unitId },
      data: { renewalDate: input.nextDueDate },
    }),
  ]);

  return log;
}

async function findOwnedServiceLog(businessId: string, id: string) {
  const existing = await prisma.serviceLog.findUnique({
    where: { id },
    include: { unit: { include: { customer: true } } },
  });
  if (!existing || existing.unit.customer.businessId !== businessId) {
    throw new HttpError(404, "Service log not found");
  }
  return existing;
}

export async function updateServiceLog(businessId: string, id: string, input: Partial<ServiceLogInput>) {
  const existing = await findOwnedServiceLog(businessId, id);

  const updated = await prisma.serviceLog.update({
    where: { id },
    data: {
      serviceDate: input.serviceDate,
      technician: input.technician,
      amountCharged: input.amountCharged,
      notes: input.notes,
      nextDueDate: input.nextDueDate,
    },
  });

  // If this is the most recent log for the unit, keep the unit's
  // renewalDate in sync with the edited nextDueDate.
  const mostRecent = await prisma.serviceLog.findFirst({
    where: { unitId: existing.unitId },
    orderBy: { serviceDate: "desc" },
  });
  if (mostRecent?.id === id) {
    await prisma.unit.update({
      where: { id: existing.unitId },
      data: { renewalDate: updated.nextDueDate },
    });
  }

  return updated;
}

export async function deleteServiceLog(businessId: string, id: string) {
  await findOwnedServiceLog(businessId, id);
  await prisma.serviceLog.delete({ where: { id } });
}
