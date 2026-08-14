import { describe, expect, it } from "vitest";
import { monthLabel, startOfUTCMonth } from "../src/services/dashboard.service.js";

describe("startOfUTCMonth", () => {
  it("returns the first day of the given month in UTC", () => {
    expect(startOfUTCMonth(2026, 7).toISOString()).toBe("2026-08-01T00:00:00.000Z");
  });

  it("rolls over into the next year when month rolls past 11", () => {
    expect(startOfUTCMonth(2026, 12).toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });

  it("rolls back into the previous year when month is negative", () => {
    expect(startOfUTCMonth(2026, -1).toISOString()).toBe("2025-12-01T00:00:00.000Z");
  });
});

describe("monthLabel", () => {
  it("formats a date as a short month + year label", () => {
    expect(monthLabel(new Date("2026-08-14T00:00:00.000Z"))).toBe("Aug 2026");
  });
});
