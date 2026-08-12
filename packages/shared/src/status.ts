import type { UnitStatus } from "./enums.js";

export const DUE_SOON_WINDOW_DAYS = 30;

// Uses UTC day boundaries so status is deterministic regardless of the
// server/browser's local timezone (avoids drift between API and client).
function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * Single source of truth for renewal status. Derived at read time from
 * renewalDate vs now — never persisted, so it's always correct without a
 * background job re-evaluating stored rows.
 */
export function getUnitStatus(renewalDate: Date | string, now: Date = new Date()): UnitStatus {
  const renewal = startOfDay(new Date(renewalDate));
  const today = startOfDay(now);

  if (renewal.getTime() < today.getTime()) {
    return "EXPIRED";
  }

  const dueSoonCutoff = new Date(today);
  dueSoonCutoff.setDate(dueSoonCutoff.getDate() + DUE_SOON_WINDOW_DAYS);

  if (renewal.getTime() <= dueSoonCutoff.getTime()) {
    return "DUE_SOON";
  }

  return "ACTIVE";
}
