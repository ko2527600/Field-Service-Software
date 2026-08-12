import { describe, expect, it } from "vitest";
import { computeNextRenewalDate } from "@firearmour/shared";

describe("computeNextRenewalDate", () => {
  const base = new Date("2026-01-15T00:00:00Z");

  it("adds 1 month for MONTHLY", () => {
    expect(computeNextRenewalDate(base, "MONTHLY").toISOString().slice(0, 10)).toBe("2026-02-15");
  });

  it("adds 3 months for QUARTERLY", () => {
    expect(computeNextRenewalDate(base, "QUARTERLY").toISOString().slice(0, 10)).toBe("2026-04-15");
  });

  it("adds 6 months for SEMI_ANNUAL", () => {
    expect(computeNextRenewalDate(base, "SEMI_ANNUAL").toISOString().slice(0, 10)).toBe("2026-07-15");
  });

  it("adds 1 year for ANNUAL", () => {
    expect(computeNextRenewalDate(base, "ANNUAL").toISOString().slice(0, 10)).toBe("2027-01-15");
  });

  it("adds customIntervalDays for CUSTOM", () => {
    expect(computeNextRenewalDate(base, "CUSTOM", 45).toISOString().slice(0, 10)).toBe("2026-03-01");
  });

  it("falls back to 365 days for CUSTOM with no interval given", () => {
    expect(computeNextRenewalDate(base, "CUSTOM").toISOString().slice(0, 10)).toBe("2027-01-15");
  });
});
