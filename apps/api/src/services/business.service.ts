import type { BusinessProfileInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";
import { hashPassword, generateTempPassword } from "../lib/auth.js";

export async function getBusinessProfile(businessId: string) {
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new HttpError(404, "Business not found");
  return business;
}

export async function updateBusinessProfile(businessId: string, input: BusinessProfileInput) {
  return prisma.business.update({
    where: { id: businessId },
    data: {
      name: input.name,
      addressLine1: input.addressLine1 || null,
      addressLine2: input.addressLine2 || null,
      city: input.city || null,
      state: input.state || null,
      postalCode: input.postalCode || null,
      phone: input.phone || null,
      email: input.email || null,
      email2: input.email2 || null,
      smsRemindersEnabled: input.smsRemindersEnabled,
      smsReminderDaysBefore: input.smsReminderDaysBefore,
      smsGateway: input.smsGateway,
    },
  });
}

export async function listStaff(businessId: string) {
  return prisma.user.findMany({
    where: { businessId, role: "TECHNICIAN" },
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Invites a new field technician login. There's no email infrastructure yet,
 * so the generated temporary password is returned once for the admin to
 * share directly -- it is never retrievable again after this call.
 */
export async function inviteStaff(businessId: string, email: string) {
  const temporaryPassword = generateTempPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  try {
    const user = await prisma.user.create({
      data: { businessId, email, passwordHash, role: "TECHNICIAN" },
    });
    return { id: user.id, email: user.email, temporaryPassword };
  } catch (err: unknown) {
    if (typeof err === "object" && err && "code" in err && err.code === "P2002") {
      throw new HttpError(409, "That email is already in use by another login");
    }
    throw err;
  }
}

export async function revokeStaff(businessId: string, id: string) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.businessId !== businessId || existing.role !== "TECHNICIAN") {
    throw new HttpError(404, "Technician login not found");
  }
  await prisma.user.delete({ where: { id } });
}
