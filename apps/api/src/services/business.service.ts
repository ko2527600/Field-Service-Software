import type { BusinessProfileInput } from "@firearmour/shared";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/errorHandler.js";

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
