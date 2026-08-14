import { EXTINGUISHER_TYPE_LABELS } from "@firearmour/shared";
import type { SmsGateway } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { sendSms as sendSmsViaCapcom6 } from "../lib/smsGateway.js";
import { sendSms as sendSmsViaHubtel } from "../lib/hubtelSms.js";

export function sendSmsVia(gateway: SmsGateway, phone: string, text: string) {
  return gateway === "HUBTEL" ? sendSmsViaHubtel(phone, text) : sendSmsViaCapcom6(phone, text);
}

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export type ReminderRunResult = {
  checked: number;
  sent: number;
  failed: number;
  errors: string[];
};

function buildReminderText(
  businessName: string,
  businessPhone: string | null,
  customerName: string,
  unit: { type: keyof typeof EXTINGUISHER_TYPE_LABELS; size: string; serialNumber: string; renewalDate: Date },
): string {
  const renewalDateLabel = unit.renewalDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const typeLabel = EXTINGUISHER_TYPE_LABELS[unit.type];
  const contact = businessPhone ? ` at ${businessPhone}` : "";
  return `Hi ${customerName}, your ${unit.size} ${typeLabel} extinguisher (SN ${unit.serialNumber}) is due for renewal on ${renewalDateLabel}. Please contact ${businessName}${contact} to schedule a visit.`;
}

/** Finds units due within each business's configured reminder window and texts the customer once per renewal cycle (tracked via reminderSentForRenewalDate, so a later re-service that pushes the date out triggers a fresh reminder). Safe to call repeatedly -- already-reminded units are skipped. Pass businessId to scope to a single business (e.g. the manual-trigger endpoint); omit to run for every business with reminders enabled (the scheduler). */
export async function sendDueRenewalReminders(businessId?: string): Promise<ReminderRunResult> {
  const businesses = await prisma.business.findMany({
    where: { smsRemindersEnabled: true, ...(businessId ? { id: businessId } : {}) },
  });

  const result: ReminderRunResult = { checked: 0, sent: 0, failed: 0, errors: [] };

  for (const business of businesses) {
    const today = startOfDayUTC(new Date());
    const cutoff = new Date(today);
    cutoff.setUTCDate(cutoff.getUTCDate() + business.smsReminderDaysBefore);

    const units = await prisma.unit.findMany({
      where: {
        archivedAt: null,
        renewalDate: { gte: today, lte: cutoff },
        customer: { businessId: business.id, archivedAt: null },
      },
      include: { customer: true },
    });

    for (const unit of units) {
      result.checked += 1;

      const alreadySentThisCycle =
        unit.reminderSentForRenewalDate?.getTime() === unit.renewalDate.getTime();
      if (alreadySentThisCycle) continue;

      const phone = unit.customer.contactPhone;
      if (!phone) continue;

      const text = buildReminderText(business.name, business.phone, unit.customer.name, unit);
      const sendResult = await sendSmsVia(business.smsGateway, phone, text);

      if (sendResult.ok) {
        result.sent += 1;
        await prisma.unit.update({
          where: { id: unit.id },
          data: { reminderSentForRenewalDate: unit.renewalDate },
        });
      } else {
        result.failed += 1;
        result.errors.push(`${unit.customer.name} (SN ${unit.serialNumber}): ${sendResult.error}`);
      }
    }
  }

  return result;
}
