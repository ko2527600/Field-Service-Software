import type { RenewalPeriod } from "./enums.js";

/**
 * Computes the next renewal/due date from a base date and a renewal period.
 * Used both when creating a Unit (installDate -> initial renewalDate) and
 * as a display helper on the frontend (suggesting the next due date when
 * logging a service visit).
 */
export function computeNextRenewalDate(
  baseDate: Date | string,
  period: RenewalPeriod,
  customIntervalDays?: number | null,
): Date {
  const base = new Date(baseDate);
  const next = new Date(base);

  switch (period) {
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "QUARTERLY":
      next.setMonth(next.getMonth() + 3);
      break;
    case "SEMI_ANNUAL":
      next.setMonth(next.getMonth() + 6);
      break;
    case "ANNUAL":
      next.setFullYear(next.getFullYear() + 1);
      break;
    case "CUSTOM": {
      const days = customIntervalDays ?? 365;
      next.setDate(next.getDate() + days);
      break;
    }
  }

  return next;
}
